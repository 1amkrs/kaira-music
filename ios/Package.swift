// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Kaira",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "Kaira",
            targets: ["Kaira"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "Kaira",
            dependencies: [],
            path: "Kaira",
            exclude: ["Resources/Info.plist", "Resources/Kaira.entitlements", "Resources/Assets.xcassets"]
        ),
        .testTarget(
            name: "KairaTests",
            dependencies: ["Kaira"],
            path: "KairaTests"
        ),
    ]
)
