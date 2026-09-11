import deepl
import json
import time

CACHE_PATH = 'translations/translations.json'
CHUNK_SIZE = 25  # lines translated per DeepL API call
SEPARATOR = '\n'

def _read_cache():
    with open(CACHE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def _write_with_retry(path, data, attempts=30, delay=0.5):
    last_error = None
    for _ in range(attempts):
        try:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            return
        except OSError as e:
            last_error = e
            time.sleep(delay)
    raise last_error

def _translate_chunk(texts, source_language, target_language, dry_run=False):
    """Translate a batch of lines as a single DeepL API call, joined into one
    block of text so DeepL can use surrounding lines as context (rather than
    translating each line in isolation, which loses context and hurts
    quality). Returns a list of translations aligned with `texts`."""
    body = SEPARATOR.join(texts)

    if dry_run:
        print(f"===== DRY RUN: would call DeepL API, {source_language} -> {target_language}, {len(texts)} lines =====")
        print(body)
        print("===== END DRY RUN CALL =====\n")
        return [None] * len(texts)

    auth_key = ""
    deepl_client = deepl.DeepLClient(auth_key)
    print(f"Calling API to translate {len(texts)} lines to {target_language}")
    result = deepl_client.translate_text(body, source_lang=source_language, target_lang=target_language)
    translated_lines = result.text.split(SEPARATOR)
    if len(translated_lines) != len(texts):
        raise ValueError(
            f"DeepL returned {len(translated_lines)} lines for a {len(texts)}-line request "
            f"({source_language} -> {target_language}); the batch cannot be safely split back up."
        )
    return translated_lines

def translate_all(texts, source_language, target_language, dry_run=False, chunk_size=CHUNK_SIZE):
    """Translate a list of texts, using translations/translations.json as a
    cache and only calling the DeepL API for cache misses. Cache misses are
    sent to the API in chunks (multiple lines per call) instead of one call
    per line, so DeepL has enough surrounding text to translate well.

    Returns a list of translations aligned with `texts`. In dry-run mode, no
    API calls or cache writes happen; entries that would have required a call
    come back as None, and the text that would have been sent is printed.
    """
    json_data = _read_cache()

    for text in texts:
        if text not in json_data:
            json_data[text] = {source_language: text}

    seen = set()
    unique_to_translate = []
    for text in texts:
        if target_language not in json_data[text] and text not in seen:
            seen.add(text)
            unique_to_translate.append(text)

    for i in range(0, len(unique_to_translate), chunk_size):
        chunk = unique_to_translate[i:i + chunk_size]
        translated = _translate_chunk(chunk, source_language, target_language, dry_run=dry_run)
        if dry_run:
            continue
        for original, translation in zip(chunk, translated):
            json_data[original][target_language] = translation
        _write_with_retry(CACHE_PATH, json_data)

    return [json_data[text].get(target_language) for text in texts]

def translate(text, source_language, target_language):
    """Translate a single line. Kept for convenience/manual testing; prefer
    translate_all() when translating many lines so they can be batched."""
    return translate_all([text], source_language, target_language)[0]

if __name__ == '__main__':
    print(translate('Spatialisation malhérienne ', 'FR', 'EN-US'))
