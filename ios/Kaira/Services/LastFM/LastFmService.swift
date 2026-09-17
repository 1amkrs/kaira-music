import Foundation

public final class LastFmService: @unchecked Sendable {
    public static let shared = LastFmService()
    
    private let authManager = LastFmAuthManager.shared
    private let apiClient = APIClient.shared
    
    // MARK: - Signatures
    
    public func generateSignature(params: [String: String]) -> String {
        let sortedKeys = params.keys.filter { $0 != "format" && $0 != "api_sig" }.sorted()
        var signatureRaw = ""
        for k in sortedKeys {
            signatureRaw += "\(k)\(params[k] ?? "")"
        }
        signatureRaw += AppConfig.defaultLastFmSharedSecret
        return MD5.hash(signatureRaw)
    }
    
    // MARK: - Mobile Authentication
    
    public func loginWithPassword(username: String, password: String) async throws -> (username: String, sessionKey: String) {
        var params: [String: String] = [
            "method": "auth.getMobileSession",
            "api_key": AppConfig.defaultLastFmApiKey,
            "username": username,
            "password": password
        ]
        params["api_sig"] = generateSignature(params: params)
        params["format"] = "json"
        
        guard let url = URL(string: AppConfig.lastFmApiRootUrl) else {
            throw NetworkError.invalidURL
        }
        
        let bodyString = params.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        let bodyData = bodyString.data(using: .utf8)
        
        let (data, response) = try await apiClient.rawRequest(
            url: url,
            method: "POST",
            headers: ["Content-Type": "application/x-www-form-urlencoded"],
            body: bodyData
        )
        
        guard response.statusCode == 200 else {
            throw NetworkError.invalidResponse(statusCode: response.statusCode)
        }
        
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let session = json["session"] as? [String: Any],
              let key = session["key"] as? String,
              let name = session["name"] as? String else {
            throw NetworkError.decodingError("Invalid Last.fm session response")
        }
        
        await MainActor.run {
            authManager.saveSession(username: name, sessionKey: key)
        }
        
        return (username: name, sessionKey: key)
    }
    
    // MARK: - Scrobble
    
    public func scrobble(track: String, artist: String, timestamp: Int, album: String? = nil) async -> Bool {
        guard let sessionKey = await authManager.sessionKey else { return false }
        
        var params: [String: String] = [
            "method": "track.scrobble",
            "api_key": AppConfig.defaultLastFmApiKey,
            "sk": sessionKey,
            "track": track,
            "artist": artist,
            "timestamp": "\(timestamp)"
        ]
        if let album = album, !album.isEmpty {
            params["album"] = album
        }
        params["api_sig"] = generateSignature(params: params)
        params["format"] = "json"
        
        guard let url = URL(string: AppConfig.lastFmApiRootUrl) else { return false }
        let bodyString = params.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        
        do {
            let (_, response) = try await apiClient.rawRequest(
                url: url,
                method: "POST",
                headers: ["Content-Type": "application/x-www-form-urlencoded"],
                body: bodyString.data(using: .utf8)
            )
            return response.statusCode == 200
        } catch {
            return false
        }
    }
    
    // MARK: - Update Now Playing
    
    public func updateNowPlaying(track: String, artist: String, album: String? = nil) async -> Bool {
        guard let sessionKey = await authManager.sessionKey else { return false }
        
        var params: [String: String] = [
            "method": "track.updateNowPlaying",
            "api_key": AppConfig.defaultLastFmApiKey,
            "sk": sessionKey,
            "track": track,
            "artist": artist
        ]
        if let album = album, !album.isEmpty {
            params["album"] = album
        }
        params["api_sig"] = generateSignature(params: params)
        params["format"] = "json"
        
        guard let url = URL(string: AppConfig.lastFmApiRootUrl) else { return false }
        let bodyString = params.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        
        do {
            let (_, response) = try await apiClient.rawRequest(
                url: url,
                method: "POST",
                headers: ["Content-Type": "application/x-www-form-urlencoded"],
                body: bodyString.data(using: .utf8)
            )
            return response.statusCode == 200
        } catch {
            return false
        }
    }
    
    // MARK: - Love / Unlove Track
    
    public func loveTrack(track: String, artist: String) async -> Bool {
        guard let sessionKey = await authManager.sessionKey else { return false }
        var params = [
            "method": "track.love",
            "api_key": AppConfig.defaultLastFmApiKey,
            "sk": sessionKey,
            "track": track,
            "artist": artist
        ]
        params["api_sig"] = generateSignature(params: params)
        params["format"] = "json"
        
        guard let url = URL(string: AppConfig.lastFmApiRootUrl) else { return false }
        let bodyString = params.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        
        do {
            let (_, res) = try await apiClient.rawRequest(
                url: url,
                method: "POST",
                headers: ["Content-Type": "application/x-www-form-urlencoded"],
                body: bodyString.data(using: .utf8)
            )
            return res.statusCode == 200
        } catch { return false }
    }
    
    public func unloveTrack(track: String, artist: String) async -> Bool {
        guard let sessionKey = await authManager.sessionKey else { return false }
        var params = [
            "method": "track.unlove",
            "api_key": AppConfig.defaultLastFmApiKey,
            "sk": sessionKey,
            "track": track,
            "artist": artist
        ]
        params["api_sig"] = generateSignature(params: params)
        params["format"] = "json"
        
        guard let url = URL(string: AppConfig.lastFmApiRootUrl) else { return false }
        let bodyString = params.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        
        do {
            let (_, res) = try await apiClient.rawRequest(
                url: url,
                method: "POST",
                headers: ["Content-Type": "application/x-www-form-urlencoded"],
                body: bodyString.data(using: .utf8)
            )
            return res.statusCode == 200
        } catch { return false }
    }
    
    // MARK: - User Info & Recent Tracks
    
    public func getUserProfile(username: String? = nil) async -> LastFmUserProfile? {
        let user = username ?? (await authManager.username)
        guard let user = user, !user.isEmpty else { return nil }
        
        guard let encodedUser = user.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(AppConfig.lastFmApiRootUrl)?method=user.getinfo&user=\(encodedUser)&api_key=\(AppConfig.defaultLastFmApiKey)&format=json") else {
            return nil
        }
        
        do {
            let (data, res) = try await apiClient.rawRequest(url: url)
            guard res.statusCode == 200 else { return nil }
            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let userObj = json["user"] as? [String: Any] {
                let name = userObj["name"] as? String ?? user
                let realname = userObj["realname"] as? String
                let playcountStr = userObj["playcount"] as? String ?? "0"
                let playcount = Int(playcountStr) ?? 0
                
                var avatar: String? = nil
                if let images = userObj["image"] as? [[String: Any]] {
                    if let large = images.first(where: { ($0["size"] as? String) == "extralarge" || ($0["size"] as? String) == "large" }) {
                        avatar = large["#text"] as? String
                    }
                }
                let urlStr = userObj["url"] as? String
                return LastFmUserProfile(name: name, realname: realname, playcount: playcount, image: avatar, url: urlStr)
            }
        } catch {
            print("[LastFmService] getUserProfile error: \(error)")
        }
        return nil
    }
    
    public func getRecentTracks(username: String? = nil, limit: Int = 20) async -> [LastFmScrobbleTrack] {
        let user = username ?? (await authManager.username)
        guard let user = user, !user.isEmpty else { return [] }
        
        guard let encodedUser = user.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(AppConfig.lastFmApiRootUrl)?method=user.getrecenttracks&user=\(encodedUser)&api_key=\(AppConfig.defaultLastFmApiKey)&limit=\(limit)&format=json") else {
            return []
        }
        
        do {
            let (data, res) = try await apiClient.rawRequest(url: url)
            guard res.statusCode == 200 else { return [] }
            
            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let recent = json["recenttracks"] as? [String: Any],
               let tracksList = recent["track"] as? [[String: Any]] {
                return tracksList.compactMap { t in
                    let name = t["name"] as? String ?? "Unknown"
                    let artistObj = t["artist"]
                    let artistName: String
                    if let str = artistObj as? String {
                        artistName = str
                    } else if let dict = artistObj as? [String: Any], let text = dict["#text"] as? String {
                        artistName = text
                    } else {
                        artistName = "Unknown Artist"
                    }
                    let albumDict = t["album"] as? [String: Any]
                    let albumName = albumDict?["#text"] as? String
                    
                    var artworkUrl: String? = nil
                    if let images = t["image"] as? [[String: Any]],
                       let img = images.first(where: { ($0["size"] as? String) == "large" || ($0["size"] as? String) == "medium" }) {
                        artworkUrl = img["#text"] as? String
                    }
                    
                    let attr = t["@attr"] as? [String: Any]
                    let isNowPlaying = (attr?["nowplaying"] as? String) == "true"
                    let dateDict = t["date"] as? [String: Any]
                    let dateUTSStr = dateDict?["uts"] as? String ?? "0"
                    let dateUTS = Int(dateUTSStr) ?? Int(Date().timeIntervalSince1970)
                    
                    return LastFmScrobbleTrack(title: name, artist: artistName, album: albumName, artwork: artworkUrl, dateUTS: dateUTS, isNowPlaying: isNowPlaying)
                }
            }
        } catch {
            print("[LastFmService] getRecentTracks error: \(error)")
        }
        return []
    }
}
