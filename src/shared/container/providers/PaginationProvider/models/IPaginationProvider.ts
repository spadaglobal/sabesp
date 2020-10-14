import IPaginationDTO from '../dtos/IPaginationDTO';
import IPaginationResponseDTO from '../dtos/IPaginationResponseDTO';

export default interface IPaginationProvider {
  pagination(data: IPaginationDTO): Promise<IPaginationResponseDTO | []>;
}
