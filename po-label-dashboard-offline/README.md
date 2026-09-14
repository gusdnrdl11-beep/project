# PO 라벨 집계 대시보드 — Windows 오프라인 패키지

이 폴더 전체를 USB 또는 회사에서 허용한 저장 매체로 노트북에 복사하면 인터넷과 Python 설치 없이 실행할 수 있습니다. 폴더 내부 파일의 상대 위치를 유지해야 합니다.

## 실행

1. `start-dashboard.cmd`를 더블클릭합니다.
2. 잠시 후 기본 웹 브라우저에서 대시보드가 자동으로 열립니다.
3. 기본 주소는 `http://127.0.0.1:8010`입니다. 사용 중이면 8011~8020 중 사용 가능한 주소를 자동 선택하며 실행 창에 실제 주소가 표시됩니다.
4. 종료할 때는 검은 실행 창에서 `Ctrl+C`를 누릅니다.

## 테스트 주소

- 대시보드: `/`
- 설비별 가상 PO 작업지: `/po-sheets`
- 라벨 스캔 시뮬레이터: `/scanner`
- API 명세: `/docs`

## 오프라인 구성

- Python과 FastAPI 실행 환경은 `PO-Label-Dashboard` 폴더에 포함되어 있습니다.
- Tailwind CSS, Geist, JetBrains Mono, Space Grotesk, Material Symbols를 모두 로컬에 포함했습니다.
- 인터넷 주소에서 불러오는 화면 자원은 없습니다.
- 출력 테스트 데이터는 `PO-Label-Dashboard\data\labels.db`에 저장됩니다.

## 다른 노트북으로 옮길 때

`po-label-dashboard-offline` 폴더 전체를 그대로 복사하세요. `PO-Label-Dashboard.exe`만 따로 복사하면 실행되지 않습니다.

회사 보안 정책이 서명되지 않은 사내 테스트 실행 파일을 차단하면 우회하지 말고 IT 담당자에게 실행 허용 또는 코드 서명을 요청하세요. 개발용 전체 소스는 `source-code.zip`에 함께 들어 있습니다.

## 실제 API 연동 전 참고

현재 실행 파일은 더미 데이터 검증용입니다. MES/SAP/라벨 API 명세가 확정되면 `source-code.zip`의 `app/providers/company_api.py`를 기준으로 필드와 인증 방식을 연결한 뒤 오프라인 패키지를 다시 빌드합니다. 실제 운영 버전에서는 `/scanner`, `/po-sheets`, 라벨 생성 API를 비활성화하고 조회 대시보드만 노출하는 것을 권장합니다.
