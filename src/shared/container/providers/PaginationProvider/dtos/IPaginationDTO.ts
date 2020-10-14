/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface IPaginationDTO {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  searchOptions?: any;
}
