import SwiftUI
import UIKit

public final class ImageCache {
    public static let shared = NSCache<NSString, UIImage>()
}

public struct CachedAsyncImage: View {
    let url: URL?
    var placeholder: Image = Image(systemName: "music.note")
    var cornerRadius: CGFloat = 8
    
    @State private var uiImage: UIImage? = nil
    @State private var isLoading: Bool = false
    
    public init(url: URL?, placeholder: Image = Image(systemName: "music.note"), cornerRadius: CGFloat = 8) {
        self.url = url
        self.placeholder = placeholder
        self.cornerRadius = cornerRadius
    }
    
    public var body: some View {
        ZStack {
            if let image = uiImage {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } else {
                Rectangle()
                    .fill(Color(white: 0.12))
                    .overlay(
                        placeholder
                            .font(.system(size: 24))
                            .foregroundColor(.gray.opacity(0.6))
                    )
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
        .task(id: url) {
            await loadImage()
        }
    }
    
    private func loadImage() async {
        guard let url = url else { return }
        let key = NSString(string: url.absoluteString)
        
        if let cached = ImageCache.shared.object(forKey: key) {
            self.uiImage = cached
            return
        }
        
        isLoading = true
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            if let downloaded = UIImage(data: data) {
                ImageCache.shared.setObject(downloaded, forKey: key)
                withAnimation(.easeInOut(duration: 0.2)) {
                    self.uiImage = downloaded
                }
            }
        } catch {
            // Failed silently and keep placeholder
        }
        isLoading = false
    }
}
