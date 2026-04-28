import axios from 'axios';
import type { ChatRequest, ChatResponse, KpiCards } from '../types';

// ============================================================
// SnapLogic Pipeline Configuration
// ============================================================

const SNAPLOGIC_CONFIG = {
  PIPELINE_URL:
    'https://prod-srivensandbox-cloud-fm.snaplogic.io/api/1/rest/feed/run/task/srivensandbox/projects/saikiran%20pamula/sai_Rest_API_Integration%20Task',

  BEARER_TOKEN: '4UnifWMhARf1d8n8dYIAHmYWGANXaiJ7',

  EMPLOYEE_ID: 'GAC2025-FJ',

  USE_LIVE_API: true,
};

// ============================================================
// Real SnapLogic API Call
// ============================================================

const callSnapLogicPipeline = async (
  req: ChatRequest
): Promise<ChatResponse> => {
  const isDev = import.meta.env.DEV;
  const url = '/api/snaplogic';

  console.log(
    `[WorkWise API] Calling Vercel proxy (${isDev ? 'dev' : 'prod'})...`
  );

  try {
    const response = await axios.post(
      url,
      {
        employeeId: req.employeeId,
        question: req.question,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    console.log('[WorkWise API] Raw Response:', response.data);

    let pipelineOutput: any;

    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        return {
          reply:
            'Pipeline executed successfully but returned no data.',
          cards: undefined,
        };
      }

      const firstItem = response.data[0];
      pipelineOutput = firstItem?.content || firstItem;
    } else if (
      typeof response.data === 'object' &&
      response.data !== null
    ) {
      pipelineOutput =
        response.data.content ||
        response.data.output ||
        response.data.result ||
        response.data;
    } else if (typeof response.data === 'string') {
      return {
        reply: response.data,
        cards: undefined,
      };
    } else {
      pipelineOutput = response.data;
    }

    const reply =
      pipelineOutput?.reply ||
      pipelineOutput?.message ||
      pipelineOutput?.response ||
      pipelineOutput?.text ||
      JSON.stringify(pipelineOutput);

    const cards: KpiCards | undefined =
      pipelineOutput?.cards || undefined;

    return { reply, cards };
  } catch (error: any) {
    const status = error.response?.status;

    if (status) {
      if (status >= 500) {
        throw new Error(
          `SnapLogic server error (${status}). Please check pipeline.`
        );
      }

      throw new Error(
        `SnapLogic API returned HTTP ${status}.`
      );
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out.');
    }

    throw new Error(
      'Unable to reach SnapLogic services.'
    );
  }
};

// ============================================================
// Mock API Fallback
// ============================================================

const callMockApi = async (
  req: ChatRequest
): Promise<ChatResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = req.question.toLowerCase();

      let reply =
        "I'm not sure how to answer that yet.";
      let cards: KpiCards | undefined = undefined;

      if (query.includes('summary')) {
        reply =
          'Here is your workday summary.';
        cards = {
          notifications: 3,
          attendance: 'Present',
          support: 1,
          timesheet: 'Submitted',
          projects: 2,
        };
      } else if (query.includes('attendance')) {
        reply =
          'You are marked Present today.';
        cards = {
          attendance: 'Present',
        };
      } else if (query.includes('project')) {
        reply =
          'You are assigned to 2 active projects.';
        cards = {
          projects: 2,
        };
      }

      resolve({ reply, cards });
    }, 1200);
  });
};

// ============================================================
// Main Export
// ============================================================

export const chatApi = async (
  req: ChatRequest
): Promise<ChatResponse> => {
  if (
    SNAPLOGIC_CONFIG.USE_LIVE_API &&
    SNAPLOGIC_CONFIG.PIPELINE_URL &&
    SNAPLOGIC_CONFIG.BEARER_TOKEN
  ) {
    return callSnapLogicPipeline(req);
  }

  return callMockApi(req);
};

// backward compatibility
export const mockChatApi = chatApi;