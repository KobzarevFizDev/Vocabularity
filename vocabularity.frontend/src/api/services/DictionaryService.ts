/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddWordsResponse } from '../models/AddWordsResponse';
import type { DeleteWordsResponse } from '../models/DeleteWordsResponse';
import type { WordDto } from '../models/WordDto';
import type { WordListResponse } from '../models/WordListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DictionaryService {
    /**
     * Add Words To Dictionary
     * @param requestBody
     * @returns AddWordsResponse Successful Response
     * @throws ApiError
     */
    public static addWordsToDictionaryDictionaryWordsPost(
        requestBody: Array<WordDto>,
    ): CancelablePromise<AddWordsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dictionary/words',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Words From Dictionary
     * @param requestBody
     * @returns DeleteWordsResponse Successful Response
     * @throws ApiError
     */
    public static deleteWordsFromDictionaryDictionaryWordsDelete(
        requestBody: Array<string>,
    ): CancelablePromise<DeleteWordsResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/dictionary/words',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Words
     * @param page
     * @param pageSize
     * @param includeTranslate
     * @param includeTranscription
     * @param includeExamples
     * @param requestBody
     * @returns WordListResponse Successful Response
     * @throws ApiError
     */
    public static getWordsDictionaryWordsGet(
        page?: number,
        pageSize: number = 20,
        includeTranslate: boolean = true,
        includeTranscription: boolean = true,
        includeExamples: boolean = true,
        requestBody?: (Array<string> | null),
    ): CancelablePromise<WordListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dictionary/words',
            query: {
                'page': page,
                'page_size': pageSize,
                'include_translate': includeTranslate,
                'include_transcription': includeTranscription,
                'include_examples': includeExamples,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
