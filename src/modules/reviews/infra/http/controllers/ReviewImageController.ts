import UpdateReviewImageService from '@modules/reviews/services/UpdateReviewImageService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ReviewImageController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: review_id } = request.params;
    const updateReviewImage = container.resolve(UpdateReviewImageService);

    const review = await updateReviewImage.execute({
      review_id,
      filename: request.file.filename,
    });

    return response.json({ review: classToClass(review) });
  }
}
