import sys
import json
import easyocr

def read_text(image_path, languages):
    reader = easyocr.Reader(languages)
    result = reader.readtext(image_path)
    return json.dumps([{
        'bbox': [[int(coord) for coord in point] for point in bbox],
        'text': text,
        'confidence': float(conf)
    } for (bbox, text, conf) in result])

if __name__ == '__main__':
    image_path = sys.argv[1]
    languages = sys.argv[2:]
    print(read_text(image_path, languages))