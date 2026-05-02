import AppKit
import AVFoundation

struct Slide {
    let imageName: String
    let headline: String
    let subhead: String
    let duration: Double
}

let root = URL(fileURLWithPath: "/Users/openclaw/Documents/New project 3")
let demoDir = root.appendingPathComponent("demo")
let outputURL = demoDir.appendingPathComponent("focus-channel-reel-v2.mp4")

let slides = [
    Slide(
        imageName: "01-deep-work.png",
        headline: "A focus room you leave open while you work",
        subhead: "Live programming, focus prompts, and work modes for staying locked in.",
        duration: 2.2
    ),
    Slide(
        imageName: "03-adhd-mode.png",
        headline: "Switch modes based on your brain",
        subhead: "Deep work, ADHD focus, motivation, or time management.",
        duration: 2.0
    ),
    Slide(
        imageName: "04-time-management.png",
        headline: "It feels like productivity TV",
        subhead: "Now playing, live prompts, and next-up blocks instead of another dashboard.",
        duration: 2.0
    ),
    Slide(
        imageName: "05-motivation.png",
        headline: "Built for the moment before you drift",
        subhead: "Open it, pick a channel, and let the room pull you back to work.",
        duration: 2.0
    ),
    Slide(
        imageName: "02-timer-running.png",
        headline: "Would you keep this open while working?",
        subhead: "Rough demo. Looking for early feedback.",
        duration: 2.4
    )
]

let width = 1080
let height = 1920
let fps: Int32 = 30

try? FileManager.default.removeItem(at: outputURL)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false

let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: input,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height
    ]
)

writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

func paragraphStyle(alignment: NSTextAlignment = .center) -> NSMutableParagraphStyle {
    let style = NSMutableParagraphStyle()
    style.alignment = alignment
    style.lineBreakMode = .byWordWrapping
    return style
}

func drawText(_ text: String, in rect: CGRect, fontSize: CGFloat, weight: NSFont.Weight, color: NSColor) {
    let attrs: [NSAttributedString.Key: Any] = [
        .font: NSFont.systemFont(ofSize: fontSize, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: paragraphStyle()
    ]
    NSAttributedString(string: text, attributes: attrs).draw(in: rect)
}

func makePixelBuffer(for slide: Slide) -> CVPixelBuffer {
    var maybeBuffer: CVPixelBuffer?
    CVPixelBufferCreate(
        kCFAllocatorDefault,
        width,
        height,
        kCVPixelFormatType_32ARGB,
        nil,
        &maybeBuffer
    )

    guard let buffer = maybeBuffer else {
        fatalError("Could not create pixel buffer")
    }

    CVPixelBufferLockBaseAddress(buffer, [])
    defer { CVPixelBufferUnlockBaseAddress(buffer, []) }

    guard
        let baseAddress = CVPixelBufferGetBaseAddress(buffer),
        let context = CGContext(
            data: baseAddress,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
        )
    else {
        fatalError("Could not create drawing context")
    }

    let fullRect = CGRect(x: 0, y: 0, width: width, height: height)
    context.setFillColor(NSColor.black.cgColor)
    context.fill(fullRect)

    let gradient = CGGradient(
        colorsSpace: CGColorSpaceCreateDeviceRGB(),
        colors: [
            NSColor(red: 0.02, green: 0.03, blue: 0.05, alpha: 1).cgColor,
            NSColor(red: 0.06, green: 0.05, blue: 0.09, alpha: 1).cgColor
        ] as CFArray,
        locations: [0, 1]
    )
    if let gradient {
        context.drawLinearGradient(
            gradient,
            start: CGPoint(x: 0, y: 0),
            end: CGPoint(x: width, y: height),
            options: []
        )
    }

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)

    drawText(
        slide.headline,
        in: CGRect(x: 76, y: 1650, width: 928, height: 170),
        fontSize: 70,
        weight: .black,
        color: .white
    )
    drawText(
        slide.subhead,
        in: CGRect(x: 108, y: 1520, width: 864, height: 95),
        fontSize: 34,
        weight: .semibold,
        color: NSColor(red: 0.74, green: 0.80, blue: 0.88, alpha: 1)
    )

    let imageURL = demoDir.appendingPathComponent(slide.imageName)
    guard
        let image = NSImage(contentsOf: imageURL),
        let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil)
    else {
        fatalError("Could not load \(imageURL.path)")
    }

    let imageWidth = CGFloat(cgImage.width)
    let imageHeight = CGFloat(cgImage.height)
    let maxImageWidth: CGFloat = 960
    let maxImageHeight: CGFloat = 1190
    let scale = min(maxImageWidth / imageWidth, maxImageHeight / imageHeight)
    let drawWidth = imageWidth * scale
    let drawHeight = imageHeight * scale
    let imageRect = CGRect(
        x: (CGFloat(width) - drawWidth) / 2,
        y: 230,
        width: drawWidth,
        height: drawHeight
    )

    context.setShadow(offset: CGSize(width: 0, height: -24), blur: 48, color: NSColor.black.withAlphaComponent(0.55).cgColor)
    context.draw(cgImage, in: imageRect)
    context.setShadow(offset: .zero, blur: 0, color: nil)

    context.setStrokeColor(NSColor.white.withAlphaComponent(0.16).cgColor)
    context.setLineWidth(2)
    context.stroke(imageRect)

    drawText(
        "focuschannel.app",
        in: CGRect(x: 120, y: 92, width: 840, height: 50),
        fontSize: 30,
        weight: .bold,
        color: NSColor(red: 0.49, green: 0.83, blue: 0.99, alpha: 1)
    )

    NSGraphicsContext.restoreGraphicsState()
    return buffer
}

var frameIndex: Int64 = 0

for slide in slides {
    let buffer = makePixelBuffer(for: slide)
    let frameCount = Int(slide.duration * Double(fps))

    for _ in 0..<frameCount {
        while !input.isReadyForMoreMediaData {
            Thread.sleep(forTimeInterval: 0.01)
        }

        let time = CMTime(value: frameIndex, timescale: fps)
        adaptor.append(buffer, withPresentationTime: time)
        frameIndex += 1
    }
}

input.markAsFinished()

let semaphore = DispatchSemaphore(value: 0)
writer.finishWriting {
    semaphore.signal()
}
semaphore.wait()

if writer.status == .completed {
    print(outputURL.path)
} else {
    fatalError("Video export failed: \(writer.error?.localizedDescription ?? "unknown error")")
}
