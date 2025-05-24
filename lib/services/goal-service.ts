import { createDifyService } from "./dify-service";
import {
  goalServerRepository,
  type GoalVariables,
} from "../repositories/goal-server-repository";

export class GoalService {
  private getDifyService() {
    return createDifyService();
  }

  /**
   * チャットメッセージを送信し、必要に応じて目標を保存
   */
  async sendMessageAndCheckCompletion(
    content: string,
    userId: string,
    conversationId?: string,
    inputs: Record<string, any> = {}
  ) {
    const difyService = this.getDifyService();

    // 1. Difyにメッセージ送信
    const response = await difyService.sendMessage({
      query: content,
      userId,
      conversationId,
      inputs,
    });

    const newConversationId = response.conversation_id || conversationId;

    // 2. 会話完了チェック
    const completionResult = await difyService.checkVariablesComplete(
      newConversationId,
      userId
    );

    // 3. 完了していれば目標を保存
    if (completionResult.isComplete) {
      await this.saveGoalsFromConversation(userId, newConversationId);
    }

    return {
      response,
      isComplete: completionResult.isComplete,
      missingVariables: completionResult.missingVariables,
    };
  }

  /**
   * 会話から目標を抽出してSupabaseに保存
   */
  async saveGoalsFromConversation(userId: string, conversationId: string) {
    const difyService = this.getDifyService();

    // 1. Difyから会話変数を取得
    const variables = await difyService.getConversationVariables(
      conversationId,
      userId
    );

    // 2. 変数を抽出
    const getVar = (name: string) =>
      variables.find((v: any) => v.name === name)?.value || "";

    const goalVariables: GoalVariables = {
      idealFuture: getVar("Ideal_Future"),
      quarterGoal: getVar("Quarter_goal"),
      oneMonthGoal: getVar("OneMonth_Goal"),
      limitRules: getVar("Limit_Rules"),
      oneWeekGoal: getVar("OneWeek_Goal"),
      dailyTasks: getVar("Daily_Tasks"),
    };

    // 3. Supabaseに保存
    return await goalServerRepository.saveGoalHierarchy(userId, goalVariables);
  }
}

export const goalService = new GoalService();
