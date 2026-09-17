import SwiftUI

public struct AlbumCardView: View {
    let album: MusicAlbum
    var size: CGFloat = 150
    var onTap: () -> Void
    
    public init(album: MusicAlbum, size: CGFloat = 150, onTap: @escaping () -> Void) {
        self.album = album
        self.size = size
        self.onTap = onTap
    }
    
    public var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 8) {
                CachedAsyncImage(
                    url: URL(string: album.artworkUrl ?? ""),
                    placeholder: Image(systemName: "opticaldisc"),
                    cornerRadius: 12
                )
                .frame(width: size, height: size)
                .shadow(color: .black.opacity(0.4), radius: 8, x: 0, y: 4)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(album.title)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                    
                    Text(album.artist)
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
                .frame(width: size, alignment: .leading)
            }
        }
        .buttonStyle(.plain)
    }
}
