import urllib.request, json, sys
sys.stdout.reconfigure(encoding='utf-8')

session_cookie = '__Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoidjRfVnZUQm53c0F2T2p1ZTB0Y2dKN19QWTJfdjlBNFlVc1R2MGt4TmlPbUdPNVhUdGt4bEphMk1OZ3MteDV4NWVYY0RIbWtuWXpURU93aHRWbUdFU0EifQ..M0e3uMmronmiGWEJ3nxW0Q.N0KUMrotpYvw_9HQ1gGE10ck9CSqvxMNcczxe2nJiHv7zYWvsWJ1-S5ePxBQ1bN3r-4nDQyzfYqFDYQYq0eK8JPCeFrM-AMntlrrHLfiU5Qvia_iEGGJRO4LwVm1xVG2cil9Yx0rhqvFF9Ozqx4szlXKqYhEjl5JqcKA3TpU9dBluYFCH1cuaOtDgKS1sx_lxKLJ_gNB0LQgDQ_UYGDXdQYT84-jJAFT1M4yQW7gF-t430DFTnaCzL-qVKJL7you5_eAvd_o1o6h8W2jjrv0eiUEbva3FacHDB7l-P2TxhNXT497x4LbJmGbY7wT-XUJ3eUKrTsXy_1Ic6KZ3rK7CXzBPfV5ZRNb1qcW0c26hBU._VltIv7PXV1QvKSYRutZ6G5EmUd_RsdTgYuwhdnMTo4; __Host-authjs.csrf-token=904f2a7b8371142432216ca5d0ab9af9188bcc8bd92c49e152a96904c123229d%7C88bbe6e36daceefe9ea63eccf9f558c38d3100da88baf000069269f6d2bbc639; NEXT_LOCALE=id'

urls = [
    'https://tranvas.com/api/habits?period=2026-08',
    'https://tranvas.com/api/planner/tasks?date=2026-08-31',
    'https://tranvas.com/api/planner/daily?date=2026-08-31',
]

for url in urls:
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Cookie': session_cookie,
    })
    try:
        res = urllib.request.urlopen(req)
        body = res.read().decode('utf-8', errors='replace')
        data = json.loads(body)
        if isinstance(data, list):
            print(f'[OK] {url} -> {len(data)} items')
        else:
            print(f'[OK] {url} -> {str(data)[:200]}')
    except urllib.error.HTTPError as e:
        print(f'[ERR {e.code}] {url} -> {e.read().decode("utf-8", errors="replace")[:200]}')
    except Exception as ex:
        print(f'[EX] {url} -> {ex}')
