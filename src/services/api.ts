import axios from 'axios';
import type { ChatRequest, ChatResponse, KpiCards } from '../types';

// ============================================================
//  SnapLogic Pipeline Configuration
//  ✅ LIVE INTEGRATION — Connected to SnapLogic Triggered Task
// ============================================================

const SNAPLOGIC_CONFIG = {
  // SnapLogic Triggered Task URL (POST endpoint)
  PIPELINE_URL:
    'https://prod-srivensandbox-cloud-fm.snaplogic.io/api/1/rest/feed/run/task/srivensandbox/projects/saikiran%20pamula/sai_Rest_API_Integration%20Task',

  // Bearer token for authorization
  BEARER_TOKEN: '4UnifWMhARf1d8n8dYIAHmYWGANXaiJ7',

  // The Employee ID to send with every request
  EMPLOYEE_ID: 'GAC2025-FJ',

  // Set to true to use the real SnapLogic pipeline, false for mock data
  USE_LIVE_API: true,
};

// ============================================================
//  Real SnapLogic API Call
//  Sends a POST to your Triggered Pipeline Task with Bearer auth
//  Uses the Vite dev proxy at /snaplogic-api to bypass CORS
// ============================================================
const callSnapLogicPipeline = async (req: ChatRequest): Promise<ChatResponse> => {
  const isDev = import.meta.env.DEV;

  // In production we call the Vercel serverless proxy (same origin, no CORS)
  const url = '/api/snaplogic';

  console.log(`[WorkWise API] Calling Vercel proxy (${isDev ? 'via proxy' : 'direct'})...`);
  console.log(`[WorkWise API] Params:`, { employeeId: req.employeeId, question: req.question });

  try {
    const response = await axios.post(
      url,
      {
        employeeId: req.employeeId,
        question: req.question,
      },
      {
        headers: {
          // No auth header needed here – the serverless function adds the Bearer token
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    console.log('[WorkWise API] Raw SnapLogic Response (proxied):', response.data);

    // SnapLogic Triggered Tasks return: [{ content: { reply, cards }, status, content-type }]
    let pipelineOutput: any;

    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        return {
          reply: 'The pipeline executed successfully but returned no data. Please verify the pipeline logic in SnapLogic Designer.',
          cards: undefined,
        };
      }
      const firstItem = response.data[0];
      // Handle nested content wrapper: { content: { reply, cards }, status }
      pipelineOutput = firstItem?.content || firstItem;
    } else if (typeof response.data === 'object' && response.data !== null) {
      pipelineOutput = response.data.content || response.data.output || response.data.result || response.data;
    } else if (typeof response.data === 'string') {
      return { reply: response.data, cards: undefined };
    } else {
      pipelineOutput = response.data;
    }

    // Normalize the response
    const reply = pipelineOutput?.reply
      || pipelineOutput?.message
      || pipelineOutput?.response
      || pipelineOutput?.text
      || (typeof pipelineOutput === 'string' ? pipelineOutput : JSON.stringify(pipelineOutput));

    const cards: KpiCards | undefined = pipelineOutput?.cards || undefined;

    return { reply, cards };
  } catch (error: any) {
      } else if (status >= 500) {
        // Extract the actual error from SnapLogic's response body
        const errorBody = error.response.data;
        const failureMsg = errorBody?.failure || errorBody?.message || '';
        const reasonMsg = errorBody?.reason || '';
        const detail = [failureMsg, reasonMsg].filter(Boolean).join(' — ') || 'Unknown error';
        throw new Error(`SnapLogic Error (${status}): ${detail}. Please check the pipeline in SnapLogic Designer.`);
      }
      throw new Error(`SnapLogic API returned HTTP ${status}. Please try again.`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The pipeline is taking too long to respond.');
    }
    throw new Error('Unable to reach SnapLogic services. Please check your network connection.');
  }
};

// ============================================================
//  Mock/Fallback API  (used when USE_LIVE_API = false)
// ============================================================
const callMockApi = async (req: ChatRequest): Promise<ChatResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const query = req.question.toLowerCase();
      let reply = "I'm not exactly sure how to answer that. Try asking about your summary, notifications, attendance, support, or projects.";
      let cards: KpiCards | undefined = undefined;

      if (query.includes('fail')) {
        reject(new Error('Live services unavailable. Please try again.'));
        return;
      }

      if (query.includes('summary')) {
        reply = 'Here is your workday summary. You have 3 notifications, checked in at 9:08 AM, and 1 support request pending.';
        cards = { notifications: 3, attendance: 'Present', support: 1, timesheet: 'Submitted', projects: 2 };
      } else if (query.includes('notification')) {
        reply = 'You have 3 unread notifications relating to your timesheets and HR announcements.';
        cards = { notifications: 3 };
      } else if (query.includes('attendance')) {
        reply = 'You are marked as Present. Check-in time was 9:08 AM.';
        cards = { attendance: 'Present' };
      } else if (query.includes('support')) {
        reply = 'You have 1 pending IT support request regarding your laptop replacement.';
        cards = { support: 1 };
      } else if (query.includes('timesheet')) {
        reply = 'Your timesheet is marked as Submitted for this week.';
        cards = { timesheet: 'Submitted' };
      } else if (query.includes('project')) {
        reply = 'You are currently assigned to 2 active projects: WorkWise Migration and SnapLogic Integration.';
        cards = { projects: 2 };
      }

      resolve({ reply, cards });
    }, 1500);
  });
};

// ============================================================
//  Main Export — auto-routes to live or mock based on config
// ============================================================
export const chatApi = async (req: ChatRequest): Promise<ChatResponse> => {
  if (SNAPLOGIC_CONFIG.USE_LIVE_API && SNAPLOGIC_CONFIG.PIPELINE_URL && SNAPLOGIC_CONFIG.BEARER_TOKEN) {
    return callSnapLogicPipeline(req);
  }
  // Fall back to mock if not configured
  return callMockApi(req);
};

// Keep old export name for backwards compat
export const mockChatApi = chatApi;
