import SwiftUI
import UIKit

@MainActor
public final class ArtworkColorExtractor: ObservableObject {
    public static let shared = ArtworkColorExtractor()
    
    private var cache = [String: Color]()
    
    public func dominantColor(for imageUrlString: String?, defaultColor: Color = Color(red: 0.15, green: 0.15, blue: 0.20)) -> Color {
        guard let urlStr = imageUrlString, !urlStr.isEmpty else {
            return defaultColor
        }
        if let cached = cache[urlStr] {
            return cached
        }
        return defaultColor
    }
    
    public func extractColor(from url: URL) async -> Color {
        let key = url.absoluteString
        if let cached = cache[key] {
            return cached
        }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            guard let image = UIImage(data: data) else {
                return Color(red: 0.15, green: 0.15, blue: 0.20)
            }
            
            let color = image.averageColor()
            cache[key] = color
            return color
        } catch {
            return Color(red: 0.15, green: 0.15, blue: 0.20)
        }
    }
}

extension UIImage {
    func averageColor() -> Color {
        guard let inputImage = CIImage(image: self) else {
            return Color(red: 0.15, green: 0.15, blue: 0.20)
        }
        
        let extentVector = CIVector(x: inputImage.extent.origin.x,
                                   y: inputImage.extent.origin.y,
                                   z: inputImage.extent.size.width,
                                   w: inputImage.extent.size.height)
        
        guard let filter = CIFilter(name: "CIAreaAverage", parameters: [kCIInputImageKey: inputImage, kCIInputExtentKey: extentVector]),
              let outputImage = filter.outputImage else {
            return Color(red: 0.15, green: 0.15, blue: 0.20)
        }
        
        var bitmap = [UInt8](repeating: 0, count: 4)
        let context = CIContext(options: [.workingColorSpace: kCFNull as Any])
        context.render(outputImage, toBitmap: &bitmap, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1), format: .RGBA8, colorSpace: nil)
        
        let r = Double(bitmap[0]) / 255.0
        let g = Double(bitmap[1]) / 255.0
        let b = Double(bitmap[2]) / 255.0
        
        return Color(red: r, green: g, blue: b)
    }
}
