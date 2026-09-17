import Foundation

public final class LrclibAPI: @unchecked Sendable {
    public static let shared = LrclibAPI()
    
    private let apiClient = APIClient.shared
    
    // MARK: - Parse LRC Format
    
    public func parseLRC(_ lrcText: String) -> [LyricLine] {
        guard !lrcText.isEmpty else { return [] }
        
        let lines = lrcText.components(separatedBy: .newlines)
        var result: [LyricLine] = []
        var lineIndex = 0
        
        // Regex to extract [mm:ss.xx] or [mm:ss.xxx]
        let pattern = "\\[(\\d{2}):(\\d{2})(?:\\.(\\d{2,3}))?\\]"
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return [] }
        
        for rawLine in lines {
            let line = rawLine.trimmingCharacters(in: .whitespaces)
            guard !line.isEmpty else { continue }
            
            let nsString = line as NSString
            let matches = regex.matches(in: line, range: NSRange(location: 0, length: nsString.length))
            guard !matches.isEmpty else { continue }
            
            // Clean text without bracket timestamps
            var text = regex.stringByReplacingMatches(in: line, range: NSRange(location: 0, length: nsString.length), withTemplate: "")
            text = text.trimmingCharacters(in: .whitespaces)
            
            for match in matches {
                guard match.numberOfRanges >= 3 else { continue }
                
                let minRange = match.range(at: 1)
                let secRange = match.range(at: 2)
                let minutes = Int(nsString.substring(with: minRange)) ?? 0
                let seconds = Int(nsString.substring(with: secRange)) ?? 0
                
                var millis = 0
                if match.numberOfRanges >= 4, match.range(at: 3).location != NSNotFound {
                    var fracStr = nsString.substring(with: match.range(at: 3))
                    while fracStr.count < 3 { fracStr += "0" }
                    if fracStr.count > 3 { fracStr = String(fracStr.prefix(3)) }
                    millis = Int(fracStr) ?? 0
                }
                
                let totalMs = minutes * 60 * 1000 + seconds * 1000 + millis
                result.append(LyricLine(id: lineIndex, timeMs: totalMs, text: text))
                lineIndex += 1
            }
        }
        
        return result.sorted { $0.timeMs < $1.timeMs }
    }
    
    // MARK: - Fetch Lyrics
    
    public func fetchLyrics(
        trackTitle: String,
        artistName: String,
        albumName: String? = nil,
        duration: TimeInterval? = nil
    ) async -> LyricsResult {
        // First check if track has embedded lyrics
        if let encodedTrack = trackTitle.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let encodedArtist = artistName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) {
            
            var urlString = "\(AppConfig.lrclibBaseUrl)/get?track_name=\(encodedTrack)&artist_name=\(encodedArtist)"
            if let album = albumName?.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed), !album.isEmpty {
                urlString += "&album_name=\(album)"
            }
            if let dur = duration, dur > 0 {
                urlString += "&duration=\(Int(dur.rounded()))"
            }
            
            if let url = URL(string: urlString) {
                do {
                    let (data, response) = try await apiClient.rawRequest(url: url)
                    if response.statusCode == 200,
                       let dto = try? JSONDecoder().decode(LrclibResponseDTO.self, from: data) {
                        if dto.instrumental == true {
                            return LyricsResult(synced: [], plain: nil, isInstrumental: true)
                        }
                        if let synced = dto.syncedLyrics, !synced.isEmpty {
                            return LyricsResult(synced: parseLRC(synced), plain: dto.plainLyrics, isInstrumental: false)
                        }
                        if let plain = dto.plainLyrics, !plain.isEmpty {
                            return LyricsResult(synced: [], plain: plain, isInstrumental: false)
                        }
                    }
                } catch {
                    // Fall back to search endpoint
                }
            }
        }
        
        // Fallback: search endpoint
        return await searchLyricsFallback(trackTitle: trackTitle, artistName: artistName)
    }
    
    private func searchLyricsFallback(trackTitle: String, artistName: String) async -> LyricsResult {
        guard let encodedTrack = trackTitle.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let encodedArtist = artistName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(AppConfig.lrclibBaseUrl)/search?track_name=\(encodedTrack)&artist_name=\(encodedArtist)") else {
            return LyricsResult(synced: [], plain: nil, isInstrumental: false)
        }
        
        do {
            let (data, response) = try await apiClient.rawRequest(url: url)
            if response.statusCode == 200,
               let list = try? JSONDecoder().decode([LrclibResponseDTO].self, from: data),
               let first = list.first {
                if first.instrumental == true {
                    return LyricsResult(synced: [], plain: nil, isInstrumental: true)
                }
                if let synced = first.syncedLyrics, !synced.isEmpty {
                    return LyricsResult(synced: parseLRC(synced), plain: first.plainLyrics, isInstrumental: false)
                }
                if let plain = first.plainLyrics, !plain.isEmpty {
                    return LyricsResult(synced: [], plain: plain, isInstrumental: false)
                }
            }
        } catch {
            print("[LrclibAPI] Search fallback failed: \(error)")
        }
        
        return LyricsResult(synced: [], plain: nil, isInstrumental: false)
    }
}

struct LrclibResponseDTO: Decodable {
    let id: Int?
    let name: String?
    let trackName: String?
    let artistName: String?
    let albumName: String?
    let duration: Double?
    let instrumental: Bool?
    let plainLyrics: String?
    let syncedLyrics: String?
}
