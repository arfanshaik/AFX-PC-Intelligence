# AFX PC Intelligence — methodology

This project is a hackathon prototype and learning tool. It is intentionally deterministic so the same inputs produce the same result.

## Build generation

The local catalogue contains representative component classes, socket and memory-generation fields, approximate power requirements, and illustrative INR prices. The generator searches complete compatible combinations that fit the chosen budget and scores them for the selected workload. It does not query retailers, guarantee availability, include tax/shipping/assembly, or choose an exact manufacturer SKU.

## Compatibility

The checker validates the catalogue relationships: CPU socket, memory generation and capacity, board/case form factor, representative GPU clearance, PSU headroom, cooling support and an M.2 storage slot. Always confirm the exact manufacturer model, BIOS version, dimensions, connectors and clearance before buying.

## Scores

Gaming, development, AI/ML and creative scores combine catalogue anchors for the CPU, GPU, memory and storage. They are relative AFX model scores intended for comparison inside this prototype. They are not laboratory measurements, frame-time tests or purchase guarantees.

## FPS estimates

FPS values blend the selected game’s illustrative anchor with CPU/GPU catalogue ratios, resolution scale, quality preset, and a memory penalty below 16GB. Ray tracing, upscaling, frame generation, patches, drivers, cooling, background tasks and scene choice are not simulated. Treat the range as a rough planning prompt, not a benchmark.

## Browser information

The browser page only displays information the current browser exposes locally. It does not claim to identify the exact CPU or GPU, and it does not send the values to a server.
