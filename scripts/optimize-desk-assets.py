from pathlib import Path
import base64
import io
import re
from PIL import Image

source = Path('src/assets/assets/SVG')
target = Path('src/assets/desk-optimized')
target.mkdir(parents=True, exist_ok=True)
for original in sorted(source.glob('Asset *.svg')):
    svg = original.read_text(encoding='utf-8')
    match = re.search(r'data:image/png;base64,([^"\']+)', svg)
    if not match:
        continue
    image = Image.open(io.BytesIO(base64.b64decode(match.group(1))))
    encoded = io.BytesIO()
    image.save(encoded, format='WEBP', quality=88, method=6)
    replacement = 'data:image/webp;base64,' + base64.b64encode(encoded.getvalue()).decode('ascii')
    optimized = svg[:match.start()] + replacement + svg[match.end():]
    destination = target / original.name
    destination.write_text(optimized, encoding='utf-8')
    print(f'{original.name}: {original.stat().st_size:,} -> {destination.stat().st_size:,} bytes ({destination.stat().st_size/original.stat().st_size:.1%})')
