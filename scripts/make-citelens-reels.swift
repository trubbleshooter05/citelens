import AppKit
import AVFoundation

struct Slide { let image: String; let headline: String; let subhead: String; let duration: Double }
struct Reel { let filename: String; let slides: [Slide] }

let root = URL(fileURLWithPath: "/Users/openclaw/Documents/New project 3")
let dir = root.appendingPathComponent("demo/citelens")
let width = 1080
let height = 1920
let fps: Int32 = 30

let reels = [
    Reel(filename: "citelens-ugc-1-competitors.mp4", slides: [
        Slide(image: "01-hero.png", headline: "AI might be recommending your competitors", subhead: "CiteLens shows why ChatGPT, Claude, Perplexity, Gemini, and AI Overviews cite them instead.", duration: 2.4),
        Slide(image: "02-enter-site.png", headline: "Enter your website", subhead: "Run a sample AI citation audit for your brand.", duration: 1.8),
        Slide(image: "03-action-report.png", headline: "Get a weekly to-do list", subhead: "Not just mentioned/not mentioned. Exact content fixes.", duration: 2.2),
        Slide(image: "04-diagnosis.png", headline: "See the prompt and page to fix", subhead: "Which query you lose, which page should win, and who AI cites instead.", duration: 2.5),
        Slide(image: "05-actions.png", headline: "Fix what AI can cite", subhead: "FAQs, comparison pages, schema, stats, and source gaps.", duration: 2.3)
    ]),
    Reel(filename: "citelens-ugc-2-action-engine.mp4", slides: [
        Slide(image: "03-action-report.png", headline: "Most GEO tools stop at dashboards", subhead: "CiteLens turns AI visibility gaps into weekly execution tasks.", duration: 2.5),
        Slide(image: "04-diagnosis.png", headline: "Prompt-to-page diagnosis", subhead: "Every lost prompt maps to a page and a specific fix.", duration: 2.4),
        Slide(image: "05-actions.png", headline: "Built for SMB marketers", subhead: "Less reporting. More 'change this page this week.'", duration: 2.4)
    ]),
    Reel(filename: "citelens-ugc-3-agency-offer.mp4", slides: [
        Slide(image: "01-hero.png", headline: "SEO agencies need a new monthly report", subhead: "Clients are asking why AI tools don't mention them.", duration: 2.4),
        Slide(image: "04-diagnosis.png", headline: "Show what AI says", subhead: "Prompts, competitors cited, missing pages, and exact changes.", duration: 2.5),
        Slide(image: "05-actions.png", headline: "Sell AI visibility fixes", subhead: "A clear recurring service clients can understand.", duration: 2.5)
    ])
]

func text(_ value: String, _ rect: CGRect, _ size: CGFloat, _ weight: NSFont.Weight, _ color: NSColor) {
    let style = NSMutableParagraphStyle()
    style.alignment = .center
    style.lineBreakMode = .byWordWrapping
    NSAttributedString(string: value, attributes: [
        .font: NSFont.systemFont(ofSize: size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: style
    ]).draw(in: rect)
}

func buffer(_ slide: Slide) -> CVPixelBuffer {
    var px: CVPixelBuffer?
    CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32ARGB, nil, &px)
    let pixel = px!
    CVPixelBufferLockBaseAddress(pixel, [])
    defer { CVPixelBufferUnlockBaseAddress(pixel, []) }
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pixel), width: width, height: height, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixel), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
    ctx.setFillColor(NSColor(red: 0.04, green: 0.06, blue: 0.12, alpha: 1).cgColor)
    ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))

    let gradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [
        NSColor(red: 0.04, green: 0.06, blue: 0.12, alpha: 1).cgColor,
        NSColor(red: 0.09, green: 0.18, blue: 0.40, alpha: 1).cgColor
    ] as CFArray, locations: [0, 1])!
    ctx.drawLinearGradient(gradient, start: CGPoint(x: 0, y: 0), end: CGPoint(x: width, y: height), options: [])

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
    text(slide.headline, CGRect(x: 70, y: 1615, width: 940, height: 210), 68, .black, .white)
    text(slide.subhead, CGRect(x: 115, y: 1480, width: 850, height: 115), 34, .semibold, NSColor(red: 0.78, green: 0.85, blue: 0.95, alpha: 1))

    let url = dir.appendingPathComponent(slide.image)
    let image = NSImage(contentsOf: url)!
    let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil)!
    let scale = min(950 / CGFloat(cg.width), 1120 / CGFloat(cg.height))
    let rect = CGRect(x: (CGFloat(width) - CGFloat(cg.width) * scale) / 2, y: 245, width: CGFloat(cg.width) * scale, height: CGFloat(cg.height) * scale)
    ctx.setShadow(offset: CGSize(width: 0, height: -24), blur: 50, color: NSColor.black.withAlphaComponent(0.45).cgColor)
    ctx.draw(cg, in: rect)
    ctx.setShadow(offset: .zero, blur: 0, color: nil)
    ctx.setStrokeColor(NSColor.white.withAlphaComponent(0.22).cgColor)
    ctx.setLineWidth(2)
    ctx.stroke(rect)
    text("citelens.app", CGRect(x: 120, y: 86, width: 840, height: 52), 32, .bold, NSColor(red: 0.58, green: 0.75, blue: 1, alpha: 1))
    NSGraphicsContext.restoreGraphicsState()
    return pixel
}

func render(_ reel: Reel) throws {
    let out = dir.appendingPathComponent(reel.filename)
    try? FileManager.default.removeItem(at: out)
    let writer = try AVAssetWriter(outputURL: out, fileType: .mp4)
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: width, AVVideoHeightKey: height])
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: width, kCVPixelBufferHeightKey as String: height])
    writer.add(input)
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    var frame: Int64 = 0
    for slide in reel.slides {
        let px = buffer(slide)
        for _ in 0..<Int(slide.duration * Double(fps)) {
            while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.01) }
            adaptor.append(px, withPresentationTime: CMTime(value: frame, timescale: fps))
            frame += 1
        }
    }
    input.markAsFinished()
    let sem = DispatchSemaphore(value: 0)
    writer.finishWriting { sem.signal() }
    sem.wait()
    print(out.path)
}

for reel in reels { try render(reel) }
