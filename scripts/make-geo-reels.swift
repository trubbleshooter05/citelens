import AppKit
import AVFoundation

struct Slide {
    let imageName: String
    let headline: String
    let subhead: String
    let duration: Double
}

struct Reel {
    let filename: String
    let slides: [Slide]
}

let root = URL(fileURLWithPath: "/Users/openclaw/Documents/New project 3")
let demoDir = root.appendingPathComponent("demo/geo")
let width = 1080
let height = 1920
let fps: Int32 = 30

let reels = [
    Reel(
        filename: "rankinllm-ugc-1-ai-recommends.mp4",
        slides: [
            Slide(imageName: "01-hero.png", headline: "Does ChatGPT recommend your business?", subhead: "Most SMBs have no idea who AI tools are sending customers to.", duration: 2.2),
            Slide(imageName: "02-enter-site.png", headline: "Enter your site", subhead: "Run a sample AI visibility audit in seconds.", duration: 1.8),
            Slide(imageName: "03-report-top.png", headline: "See your AI visibility score", subhead: "Track ChatGPT, Claude, Perplexity, Gemini, and AI Overviews.", duration: 2.2),
            Slide(imageName: "04-prompts.png", headline: "Find the prompts you lose", subhead: "See competitors mentioned instead and what to fix.", duration: 2.4),
            Slide(imageName: "05-pricing.png", headline: "Weekly fixes, not vague SEO reports", subhead: "Built for SMBs and solo marketers.", duration: 2.2)
        ]
    ),
    Reel(
        filename: "rankinllm-ugc-2-competitors.mp4",
        slides: [
            Slide(imageName: "04-prompts.png", headline: "Your competitors may already rank in AI answers", subhead: "This shows exactly which prompts you are missing.", duration: 2.4),
            Slide(imageName: "03-report-top.png", headline: "Track brand mentions weekly", subhead: "Know when AI tools mention you, ignore you, or cite someone else.", duration: 2.4),
            Slide(imageName: "05-pricing.png", headline: "Start at $29/mo", subhead: "A cheaper GEO tracker for SMBs priced out of enterprise tools.", duration: 2.4)
        ]
    ),
    Reel(
        filename: "rankinllm-ugc-3-agency.mp4",
        slides: [
            Slide(imageName: "01-hero.png", headline: "New service idea for SEO freelancers", subhead: "Sell monthly AI visibility reports to local businesses.", duration: 2.3),
            Slide(imageName: "04-prompts.png", headline: "Show clients what AI says", subhead: "Prompt tracking, competitor mentions, and suggested content fixes.", duration: 2.5),
            Slide(imageName: "05-pricing.png", headline: "White-label tier for agencies", subhead: "Simple recurring report clients can actually understand.", duration: 2.5)
        ]
    )
]

func drawText(_ text: String, in rect: CGRect, size: CGFloat, weight: NSFont.Weight, color: NSColor) {
    let style = NSMutableParagraphStyle()
    style.alignment = .center
    style.lineBreakMode = .byWordWrapping
    let attrs: [NSAttributedString.Key: Any] = [
        .font: NSFont.systemFont(ofSize: size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: style
    ]
    NSAttributedString(string: text, attributes: attrs).draw(in: rect)
}

func makeBuffer(slide: Slide) -> CVPixelBuffer {
    var buffer: CVPixelBuffer?
    CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32ARGB, nil, &buffer)
    guard let pixelBuffer = buffer else { fatalError("No buffer") }
    CVPixelBufferLockBaseAddress(pixelBuffer, [])
    defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, []) }

    let context = CGContext(
        data: CVPixelBufferGetBaseAddress(pixelBuffer),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
    )!

    context.setFillColor(NSColor(red: 0.96, green: 0.97, blue: 0.99, alpha: 1).cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)

    drawText(slide.headline, in: CGRect(x: 70, y: 1625, width: 940, height: 190), size: 68, weight: .black, color: NSColor(red: 0.07, green: 0.09, blue: 0.15, alpha: 1))
    drawText(slide.subhead, in: CGRect(x: 110, y: 1490, width: 860, height: 110), size: 34, weight: .semibold, color: NSColor(red: 0.38, green: 0.45, blue: 0.56, alpha: 1))

    let imageURL = demoDir.appendingPathComponent(slide.imageName)
    guard let image = NSImage(contentsOf: imageURL), let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        fatalError("Missing \(slide.imageName)")
    }
    let iw = CGFloat(cgImage.width)
    let ih = CGFloat(cgImage.height)
    let scale = min(940 / iw, 1120 / ih)
    let rect = CGRect(x: (CGFloat(width) - iw * scale) / 2, y: 250, width: iw * scale, height: ih * scale)
    context.setShadow(offset: CGSize(width: 0, height: -18), blur: 42, color: NSColor.black.withAlphaComponent(0.16).cgColor)
    context.draw(cgImage, in: rect)
    context.setShadow(offset: .zero, blur: 0, color: nil)
    context.setStrokeColor(NSColor(red: 0.82, green: 0.86, blue: 0.92, alpha: 1).cgColor)
    context.setLineWidth(2)
    context.stroke(rect)

    drawText("RankInLLM.com", in: CGRect(x: 120, y: 90, width: 840, height: 50), size: 30, weight: .bold, color: NSColor(red: 0.15, green: 0.39, blue: 0.92, alpha: 1))
    NSGraphicsContext.restoreGraphicsState()
    return pixelBuffer
}

func render(_ reel: Reel) throws {
    let output = demoDir.appendingPathComponent(reel.filename)
    try? FileManager.default.removeItem(at: output)
    let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height
    ])
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height
    ])
    writer.add(input)
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)

    var frame: Int64 = 0
    for slide in reel.slides {
        let buffer = makeBuffer(slide: slide)
        for _ in 0..<Int(slide.duration * Double(fps)) {
            while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.01) }
            adaptor.append(buffer, withPresentationTime: CMTime(value: frame, timescale: fps))
            frame += 1
        }
    }

    input.markAsFinished()
    let sem = DispatchSemaphore(value: 0)
    writer.finishWriting { sem.signal() }
    sem.wait()
    print(output.path)
}

for reel in reels {
    try render(reel)
}
