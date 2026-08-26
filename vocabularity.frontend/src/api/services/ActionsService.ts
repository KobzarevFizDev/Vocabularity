/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionResponse } from '../models/ActionResponse';
import type { ClearCandidatesAction } from '../models/ClearCandidatesAction';
import type { PageAction } from '../models/PageAction';
import type { SuggestCandidatesAction } from '../models/SuggestCandidatesAction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActionsService {
    /**
     * Action
     * @param requestBody
     * @returns ActionResponse Successful Response
     * @throws ApiError
     */
    public static actionActionsPost(
        requestBody: (PageAction | SuggestCandidatesAction | ClearCandidatesAction),
    ): CancelablePromise<ActionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/actions/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
