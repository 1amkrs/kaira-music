import SwiftUI

public struct EqualizerSheetView: View {
    @ObservedObject private var eq = EqualizerEngine.shared
    @Environment(\.dismiss) private var dismiss
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Master Toggle
                    Toggle(isOn: $eq.isEnabled) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Studio Equalizer")
                                .font(.system(size: 17, weight: .semibold))
                                .foregroundColor(.white)
                            Text("Real-time parametric DSP processing")
                                .font(.system(size: 13))
                                .foregroundColor(.gray)
                        }
                    }
                    .tint(.yellow)
                    .padding()
                    .background(Color(white: 0.12))
                    .cornerRadius(14)
                    
                    // Presets Horizontal Carousel
                    VStack(alignment: .leading, spacing: 10) {
                        Text("PRESETS")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.gray)
                            .padding(.horizontal, 4)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(EqualizerEngine.presets) { preset in
                                    let isSelected = eq.currentPreset == preset.name
                                    Button {
                                        eq.applyPreset(preset)
                                        HapticFeedback.playSelection()
                                    } label: {
                                        Text(preset.name)
                                            .font(.system(size: 13, weight: isSelected ? .bold : .medium))
                                            .foregroundColor(isSelected ? .black : .white)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(isSelected ? Color.yellow : Color(white: 0.14))
                                            .cornerRadius(20)
                                    }
                                }
                            }
                        }
                    }
                    
                    // 10-Band Sliders
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Text("10-BAND GRAPHIC EQ")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.gray)
                            Spacer()
                            Text("+12 dB / -12 dB")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                        }
                        .padding(.horizontal, 4)
                        
                        HStack(spacing: 10) {
                            ForEach(0..<10, id: \.self) { idx in
                                VStack(spacing: 8) {
                                    Text(String(format: "%+.0f", eq.gains[idx]))
                                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                                        .foregroundColor(eq.gains[idx] == 0 ? .gray : .yellow)
                                    
                                    // Custom Vertical Slider
                                    VerticalSlider(
                                        value: Binding(
                                            get: { eq.gains[idx] },
                                            set: { eq.setGain(at: idx, gainDb: $0) }
                                        ),
                                        range: -12.0...12.0
                                    )
                                    .frame(width: 24, height: 160)
                                    
                                    Text(EqualizerEngine.frequencyLabels[idx])
                                        .font(.system(size: 9, weight: .medium))
                                        .foregroundColor(.gray)
                                        .lineLimit(1)
                                        .minimumScaleFactor(0.8)
                                }
                                .frame(maxWidth: .infinity)
                            }
                        }
                        .padding()
                        .background(Color(white: 0.10))
                        .cornerRadius(16)
                    }
                }
                .padding(20)
            }
            .background(Color(red: 0.05, green: 0.05, blue: 0.07))
            .navigationTitle("Equalizer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundColor(.yellow)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

// Custom Vertical Slider
struct VerticalSlider: View {
    @Binding var value: Double
    let range: ClosedRange<Double>
    
    var body: some View {
        GeometryReader { geo in
            let height = geo.size.height
            let normalized = CGFloat((value - range.lowerBound) / (range.upperBound - range.lowerBound))
            let thumbY = height * (1.0 - normalized)
            
            ZStack(alignment: .bottom) {
                // Background track
                Capsule()
                    .fill(Color(white: 0.22))
                    .frame(width: 4, height: height)
                
                // Zero indicator line in middle
                Rectangle()
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: 12, height: 1)
                    .position(x: geo.size.width / 2, y: height / 2)
                
                // Thumb
                Circle()
                    .fill(Color.yellow)
                    .frame(width: 18, height: 18)
                    .shadow(color: .yellow.opacity(0.4), radius: 4)
                    .position(x: geo.size.width / 2, y: thumbY)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { gesture in
                        let locationY = min(max(gesture.location.y, 0), height)
                        let percent = 1.0 - (locationY / height)
                        let newVal = range.lowerBound + Double(percent) * (range.upperBound - range.lowerBound)
                        value = newVal
                    }
            )
        }
    }
}
