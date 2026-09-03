/**
 * 편지가 "도착"했는지 판단한다.
 * 백엔드 스케줄러가 매분 isDelivered를 켜주지만, 아직 반영되지 않았어도
 * 받을 날짜가 지났다면 도착한 것으로 본다.
 */
export const isArrived = (letter) =>
  Boolean(letter.isDelivered) ||
  (letter.deliverDate ? new Date(letter.deliverDate).getTime() <= Date.now() : false);

/**
 * 아직 고칠 수 있는 편지인가.
 *
 * 도착한 편지는 수정할 수 없다. 과거의 내가 쓴 글을 지금의 내가 고쳐 쓰면
 * 타임캡슐이라는 전제가 무너지기 때문이다. 백엔드도 같은 규칙으로 막고 있어서,
 * 여기서 감추는 건 "누를 수 없는 버튼을 보여주지 않기 위한" 화면 쪽 판단이다.
 */
export const isEditable = (letter) => !isArrived(letter);
