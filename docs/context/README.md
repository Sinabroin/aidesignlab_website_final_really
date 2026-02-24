<!-- This file defines update rules and source-tracking format. -->
# Context Docs Guide

## 목적

`docs/context`는 구현 맥락을 빠르게 검색하고 원본으로 추적하기 위한 운영 문서 모음이다.

## 파일 역할

- `implementation-index.md`: 검색 진입점(요약/태그/상태)
- `decision-log.md`: 왜 그렇게 결정했는지 기록
- `work-history.md`: 실제 진행 상태/영향 파일/검증 결과 기록

## 공통 포맷(고정)

모든 항목은 아래 블록을 포함한다.

```md
status: decided | in_progress | blocked | postponed
tags: comma,separated,keywords
요약: 120자 이내 핵심 결론
source:
- conversation_ref: ...
- related_files:
  - path/to/file
```

## 업데이트 규칙

1. 새 요구 접수 시 `implementation-index.md`에 먼저 1줄 요약 추가
2. 결정/보류가 발생하면 `decision-log.md`에 근거와 영향 범위 기록
3. 구현 시작/중간/완료 시 `work-history.md`를 갱신
4. 상태값은 반드시 표준값(`decided | in_progress | blocked | postponed`)만 사용
5. 요약만 보고도 10초 내 핵심 판단이 가능하도록 작성

## 품질 체크리스트

- 태그 검색으로 항목 탐색이 가능한가
- 요약에서 원본 파일/결정 근거로 1단계 이동이 가능한가
- 다음 세션에서 문서만으로 재개 가능한가
