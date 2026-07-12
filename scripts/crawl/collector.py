#!/usr/bin/env python3
"""로컬 수집 서버.

브라우저 페이지(eduverse-ai.app)에서 읽은 레슨 본문을 잘림 없이 디스크에 저장하기 위한
localhost 전용 수신 엔드포인트. 자격증명은 다루지 않는다 — 화면에 렌더된 콘텐츠(사용자가 수집을
승인한)를 로컬에 저장할 뿐이다.

  POST /save   body=JSON({course,id,order,title,text,links,...}) -> content-model/raw/<course>/<id>.json
  GET  /ping   -> {"ok":true}
  GET  /count  -> 저장된 파일 수(코스별)
  OPTIONS *    -> CORS preflight

사용: python scripts/crawl/collector.py [port]   (기본 8799, 127.0.0.1 바인딩)
"""
import json, os, re, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW = os.path.join(ROOT, "content-model", "raw")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8799

def safe(s):
    return re.sub(r"[^a-zA-Z0-9._-]", "_", str(s))[:120] or "x"

class H(BaseHTTPRequestHandler):
    def _cors(self, code=200, ctype="application/json"):
        self.send_response(code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        # Chrome Private Network Access: public(https) -> localhost 요청 허용
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Content-Type", ctype)
        self.end_headers()

    def log_message(self, *a):  # 조용히
        pass

    def do_OPTIONS(self):
        self._cors()

    def do_GET(self):
        if self.path.startswith("/ping"):
            self._cors(); self.wfile.write(b'{"ok":true}'); return
        if self.path.startswith("/count"):
            counts = {}
            if os.path.isdir(RAW):
                for c in os.listdir(RAW):
                    d = os.path.join(RAW, c)
                    if os.path.isdir(d):
                        counts[c] = len([f for f in os.listdir(d) if f.endswith(".json")])
            self._cors(); self.wfile.write(json.dumps(counts).encode()); return
        self._cors(404); self.wfile.write(b'{"error":"not found"}')

    def do_POST(self):
        if not self.path.startswith("/save"):
            self._cors(404); self.wfile.write(b'{"error":"not found"}'); return
        n = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(n)
        try:
            obj = json.loads(raw.decode("utf-8"))
        except Exception as e:
            self._cors(400); self.wfile.write(json.dumps({"error": str(e)}).encode()); return
        course = safe(obj.get("course", "misc"))
        ident = safe(obj.get("id") or obj.get("order") or obj.get("title") or "lesson")
        d = os.path.join(RAW, course)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, ident + ".json"), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
        self._cors(); self.wfile.write(json.dumps({"saved": course + "/" + ident, "chars": len(obj.get("text", ""))}).encode())

if __name__ == "__main__":
    os.makedirs(RAW, exist_ok=True)
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    print(f"collector listening on http://127.0.0.1:{PORT}  ->  {RAW}")
    srv.serve_forever()
