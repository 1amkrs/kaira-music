import SwiftUI
import AVKit

public struct AirPlayView: UIViewRepresentable {
    public init() {}
    
    public func makeUIView(context: Context) -> AVRoutePickerView {
        let routePickerView = AVRoutePickerView()
        routePickerView.tintColor = .lightGray
        routePickerView.activeTintColor = .systemYellow
        routePickerView.prioritizesVideoDevices = false
        return routePickerView
    }
    
    public func updateUIView(_ uiView: AVRoutePickerView, context: Context) {}
}
