export default interface ICreateReviewsRequirementsDTO {
  review_id: string;
  requirement_id: string;
  lv_id?: string;
  lv_pos_id?: string;
  status: string;
}
