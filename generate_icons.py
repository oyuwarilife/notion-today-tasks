#!/usr/bin/env python3
"""Generate simple checklist icons for the extension"""

from PIL import Image, ImageDraw

def create_icon(size):
    """Create a simple checklist icon"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Calculate sizes based on icon size
    padding = size // 8
    checkbox_size = (size - 2 * padding) // 2
    line_width = max(2, size // 16)

    # Draw background circle
    draw.ellipse(
        [padding // 2, padding // 2, size - padding // 2, size - padding // 2],
        fill='#0969da'
    )

    # Draw checkbox
    checkbox_x = padding
    checkbox_y = size // 3
    draw.rectangle(
        [checkbox_x, checkbox_y, checkbox_x + checkbox_size, checkbox_y + checkbox_size],
        fill='white',
        outline='white',
        width=line_width
    )

    # Draw checkmark
    check_padding = checkbox_size // 4
    check_points = [
        (checkbox_x + check_padding, checkbox_y + checkbox_size // 2),
        (checkbox_x + checkbox_size // 2, checkbox_y + checkbox_size - check_padding),
        (checkbox_x + checkbox_size - check_padding, checkbox_y + check_padding)
    ]
    draw.line(check_points[:2], fill='#0969da', width=line_width)
    draw.line(check_points[1:], fill='#0969da', width=line_width)

    # Draw lines (list items)
    line_x = checkbox_x + checkbox_size + padding
    line_y1 = checkbox_y + checkbox_size // 4
    line_y2 = checkbox_y + 3 * checkbox_size // 4
    line_end = size - padding

    draw.line(
        [(line_x, line_y1), (line_end, line_y1)],
        fill='white',
        width=line_width
    )
    draw.line(
        [(line_x, line_y2), (line_end, line_y2)],
        fill='white',
        width=line_width
    )

    return img

# Generate icons in different sizes
sizes = [16, 48, 128]
for size in sizes:
    icon = create_icon(size)
    icon.save(f'icons/icon{size}.png', 'PNG')
    print(f'Generated icons/icon{size}.png')

print('Icon generation complete!')
