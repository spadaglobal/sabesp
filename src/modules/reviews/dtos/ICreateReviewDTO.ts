export default interface ICreateReviewDTO {
  value: 'NSA' | 'SAT' | 'NA';
  reason_id?: string;
  observation?: string;
}
