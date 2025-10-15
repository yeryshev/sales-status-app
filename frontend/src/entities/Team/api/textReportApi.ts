import { rtkApi } from '@/shared/api/rtkApi';
import { TextReportResponse } from '../model/types/textReport';

interface TextReportParams {
  year: number;
  month: number;
  department: 'inbound' | 'account';
  type: 'done' | 'notDone' | 'plans';
}

interface UpdateTextReportParams {
  id: number;
  description: string;
}

interface CreateTextReportParams {
  idInside: number;
  year: number;
  month: number;
  department: 'inbound' | 'account';
  description: string;
  type: 'done' | 'notDone' | 'plans';
}

const textReportApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTextReport: build.query<TextReportResponse, TextReportParams>({
      query: (params) => {
        const baseUrl = import.meta.env.VITE_TEXT_REPORT_URL;

        return {
          url: baseUrl,
          method: 'GET',
          credentials: 'same-origin',
          params: {
            year: params.year,
            month: params.month,
            department: params.department,
            type: params.type,
          },
        };
      },
    }),
    updateTextReport: build.mutation<TextReportResponse, UpdateTextReportParams>({
      query: (params) => {
        const baseUrl = import.meta.env.VITE_TEXT_REPORT_URL;

        return {
          url: baseUrl,
          method: 'PATCH',
          credentials: 'same-origin',
          body: {
            id: params.id,
            description: params.description,
          },
        };
      },
      // Обновляем кэш после успешного обновления
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedReport } = await queryFulfilled;

          if (updatedReport && updatedReport.length > 0) {
            const report = updatedReport[0];

            // Обновляем кэш для соответствующего типа отчета
            dispatch(
              textReportApi.util.updateQueryData(
                'getTextReport',
                {
                  year: report.year,
                  month: report.month,
                  department: report.department,
                  type: report.type,
                },
                () => updatedReport,
              ),
            );
          }
        } catch {
          // Если запрос не удался, ничего не делаем
        }
      },
    }),
    createTextReport: build.mutation<TextReportResponse, CreateTextReportParams>({
      query: (params) => {
        const baseUrl = import.meta.env.VITE_TEXT_REPORT_URL;

        return {
          url: baseUrl,
          method: 'POST',
          credentials: 'same-origin',
          body: {
            idInside: params.idInside,
            year: params.year,
            month: params.month,
            department: params.department,
            description: params.description,
            type: params.type,
          },
        };
      },
      // Обновляем кэш после успешного создания
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newReport } = await queryFulfilled;

          if (newReport && newReport.length > 0) {
            const report = newReport[0];

            // Обновляем кэш для соответствующего типа отчета
            dispatch(
              textReportApi.util.updateQueryData(
                'getTextReport',
                {
                  year: report.year,
                  month: report.month,
                  department: report.department,
                  type: report.type,
                },
                () => newReport,
              ),
            );
          }
        } catch {
          // Если запрос не удался, ничего не делаем
        }
      },
    }),
  }),
});

export const { useGetTextReportQuery, useUpdateTextReportMutation, useCreateTextReportMutation } = textReportApi;
