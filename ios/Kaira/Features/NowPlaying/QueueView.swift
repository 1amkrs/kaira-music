import SwiftUI

public struct QueueView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @Environment(\.dismiss) private var dismiss
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            List {
                if let current = playback.currentTrack {
                    Section("Now Playing") {
                        TrackRowView(track: current, showArtwork: true) {}
                            .listRowBackground(Color.yellow.opacity(0.08))
                    }
                }
                
                Section("Up Next (\(playback.queue.count))") {
                    ForEach(playback.queue.indices, id: \.self) { idx in
                        let track = playback.queue[idx]
                        TrackRowView(
                            track: track,
                            index: idx + 1,
                            showArtwork: true
                        ) {
                            playback.play(track: track)
                        }
                    }
                    .onDelete { offsets in
                        playback.removeFromQueue(at: offsets)
                    }
                    .onMove { source, destination in
                        playback.moveInQueue(from: source, to: destination)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .background(Color(red: 0.06, green: 0.06, blue: 0.08))
            .scrollContentBackground(.hidden)
            .navigationTitle("Play Queue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    EditButton()
                        .foregroundColor(.yellow)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(.yellow)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
