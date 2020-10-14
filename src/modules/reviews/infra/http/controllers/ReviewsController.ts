import CreateReviewService from '@modules/reviews/services/CreateReviewService';
import DeleteReviewService from '@modules/reviews/services/DeleteReviewService';
import FindReviewService from '@modules/reviews/services/FindReviewService';
import ListReviewLvPosService from '@modules/reviews/services/ListReviewLvPosService';
import ListReviewLvService from '@modules/reviews/services/ListReviewLvService';
import UpdateReviewService from '@modules/reviews/services/UpdateReviewService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ReviewsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page = 1,
      limit = 10,
      lv_id = '',
      lv_pos_id = '',
      requirement_id = '',
    } = request.query;

    if (lv_pos_id) {
      const listReviews = container.resolve(ListReviewLvPosService);

      const reviews = await listReviews.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/reviews`,
        },
        entity: 'Review',
        lv_pos_id: lv_pos_id as string,
        requirement_id: requirement_id as string,
      });

      return response.json(reviews);
    }

    const listReviews = container.resolve(ListReviewLvService);

    const reviews = await listReviews.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/reviews`,
      },
      entity: 'Review',
      lv_id: lv_id as string,
      requirement_id: requirement_id as string,
    });

    return response.json(reviews);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      value,
      requirement_id,
      reason_id,
      lv_id,
      lv_pos_id,
      observation,
    } = request.body;

    const createReview = container.resolve(CreateReviewService);

    const review = await createReview.execute({
      value,
      requirement_id,
      reason_id,
      lv_id,
      lv_pos_id,
      observation,
    });

    return response.json(review);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: review_id } = request.params;
    const {
      value,
      requirement_id,
      reason_id,
      lv_id,
      lv_pos_id,
      observation,
    } = request.body;

    const updateReview = container.resolve(UpdateReviewService);

    const review = await updateReview.execute({
      review_id,
      value,
      requirement_id,
      reason_id,
      lv_id,
      lv_pos_id,
      observation,
    });

    return response.json(review);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: review_id } = request.params;

    const findReview = container.resolve(FindReviewService);

    const review = await findReview.execute({
      review_id,
    });

    return response.json(review);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: review_id } = request.params;

    const deleteReview = container.resolve(DeleteReviewService);

    await deleteReview.execute({
      review_id,
    });

    return response.status(204).json();
  }
}
