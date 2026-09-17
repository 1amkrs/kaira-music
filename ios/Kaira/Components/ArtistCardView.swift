import SwiftUI

public struct ArtistCardView: View {
    let artist: MusicArtist
    var size: CGFloat = 110
    var onTap: () -> Void
    
    public init(artist: MusicArtist, size: CGFloat = 110, onTap: @escaping () -> Void) {
        self.artist = artist
        self.size = size
        self.onTap = onTap
    }
    
    public var body: some View {
        Button(action: onTap) {
            VStack(spacing: 8) {
                CachedAsyncImage(
                    url: URL(string: artist.artworkUrl ?? ""),
                    placeholder: Image(systemName: "person.circle.fill"),
                    cornerRadius: size / 2
                )
                .frame(width: size, height: size)
                .clipShape(Circle())
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.3), radius: 6, x: 0, y: 3)
                
                Text(artist.name)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .frame(width: size)
                
                if let followers = artist.followers {
                    Text("\(followers) fans")
                        .font(.system(size: 11))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
            }
        }
        .buttonStyle(.plain)
    }
}
