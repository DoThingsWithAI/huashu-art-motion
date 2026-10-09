#!/usr/bin/env python3
"""Validate china_moon_2026.json without requiring a browser."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = json.loads((ROOT / "examples/china_moon_2026.json").read_text(encoding="utf-8"))
assert spec["grammar"] == "china_moon"
assert spec["width"] == 1280 and spec["height"] == 720
assert spec["duration"] == 52 and spec["fps"] == 24
stages = [x for x in spec["cues"] if x["kind"] == "stage"]
assert len(stages) == 8, "Expect 8 stages"
cursor = 0
for stage in stages:
    assert stage["at"] == cursor, f"Gap or overlap at {cursor}: {stage['at']}"
    assert stage["dur"] > 0
    assert stage.get("text") and stage.get("data", {}).get("scene")
    cursor += stage["dur"]
assert cursor == spec["duration"], f"Storyboard ends at {cursor}"
assert (ROOT / "clips/china_moon.js").is_file(), "Original engine clip module missing"
assert (ROOT / "clip.js").is_file(), "Original engine clip runtime missing"
print("PASS: 8 sequential scenes, 52s, 24fps; native clip engine files present")
