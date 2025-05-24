"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GoalData } from "@/types/goal-data";
import {
  Target,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Zap,
  Trophy,
  Timer,
  CalendarDays,
} from "lucide-react";

interface GoalCardProps {
  goalData: GoalData;
  hasGoals?: boolean;
}

export function GoalCard({ goalData, hasGoals = true }: GoalCardProps) {
  const [expandedSections, setExpandedSections] = useState({
    idealFuture: false,
    quarterGoal: true,
    oneMonthGoal: true,
    oneWeekGoal: true,
    limitRules: false,
    dailyTasks: true,
  });

  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTask = (taskId: string) => {
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const parseTaskItems = (text: string) => {
    return text
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("○") || line.trim().startsWith("・")
      )
      .map((line) => line.trim());
  };

  const TaskItem = ({ text, taskId }: { text: string; taskId: string }) => {
    const isCompleted = taskStates[taskId] || false;
    const cleanText = text.replace(/^[○・]\s*/, "");

    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
          isCompleted ? "bg-green-50 opacity-75" : ""
        }`}
        onClick={() => toggleTask(taskId)}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
        )}
        <span
          className={`text-sm leading-relaxed ${
            isCompleted ? "line-through text-gray-500" : "text-gray-700"
          }`}
        >
          {cleanText}
        </span>
      </div>
    );
  };

  const calculateProgress = (tasks: string[]) => {
    const completed = tasks.filter((task) => taskStates[task]).length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  };

  const oneMonthTasks = parseTaskItems(goalData.oneMonthGoal);
  const oneWeekTasks = parseTaskItems(goalData.oneWeekGoal);
  const dailyTasks = parseTaskItems(goalData.dailyTasks);
  const limitRules = parseTaskItems(goalData.limitRules);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            目標管理ダッシュボード
          </h1>
          <p className="text-gray-600">
            あなたの理想に向かって、一歩ずつ進んでいこう
          </p>
        </div>

        {/* Timeline Progress */}
        <div className="flex items-center justify-center space-x-8 py-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              理想の未来
            </span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">3ヶ月目標</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-2">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">1ヶ月目標</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              今週・今日
            </span>
          </div>
        </div>

        {/* Ideal Future */}
        <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("idealFuture")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  理想のライフスタイル
                </span>
              </div>
              {expandedSections.idealFuture ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.idealFuture && (
            <CardContent className="pt-0">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {goalData.idealFuture}
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Quarter Goal */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">3ヶ月目標</span>
              <Badge variant="secondary" className="ml-auto">
                42%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={42} className="mb-4" />
            <p className="text-gray-700 leading-relaxed">
              {goalData.quarterGoal}
            </p>
          </CardContent>
        </Card>

        {/* One Month Goal */}
        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("oneMonthGoal")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  1ヶ月目標
                </span>
                <Badge variant="secondary">
                  {Math.round(calculateProgress(oneMonthTasks))}%
                </Badge>
              </div>
              {expandedSections.oneMonthGoal ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.oneMonthGoal && (
            <CardContent className="pt-0">
              <Progress
                value={calculateProgress(oneMonthTasks)}
                className="mb-4"
              />
              <div className="space-y-2">
                {oneMonthTasks.map((task, index) => (
                  <TaskItem
                    key={`month-${index}`}
                    text={task}
                    taskId={`month-${index}`}
                  />
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* One Week Goal */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("oneWeekGoal")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  1週間目標
                </span>
                <Badge variant="secondary">
                  {Math.round(calculateProgress(oneWeekTasks))}%
                </Badge>
              </div>
              {expandedSections.oneWeekGoal ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.oneWeekGoal && (
            <CardContent className="pt-0">
              <Progress
                value={calculateProgress(oneWeekTasks)}
                className="mb-4"
              />
              <div className="space-y-2">
                {oneWeekTasks.map((task, index) => (
                  <TaskItem
                    key={`week-${index}`}
                    text={task}
                    taskId={`week-${index}`}
                  />
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Daily Tasks */}
        {/* <Card className="border-l-4 border-l-indigo-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("dailyTasks")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  日々のタスク
                </span>
                <Badge variant="secondary">
                  {Math.round(calculateProgress(dailyTasks))}%
                </Badge>
              </div>
              {expandedSections.dailyTasks ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader> */}
          {/* {expandedSections.dailyTasks && (
            <CardContent className="pt-0">
              <Progress
                value={calculateProgress(dailyTasks)}
                className="mb-4"
              />
              <div className="space-y-2">
                {dailyTasks.map((task, index) => (
                  <TaskItem
                    key={`daily-${index}`}
                    text={task}
                    taskId={`daily-${index}`}
                  />
                ))}
              </div>
            </CardContent>
          )}
        </Card> */}

        {/* Limit Rules */}
        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("limitRules")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  制限ルール
                </span>
              </div>
              {expandedSections.limitRules ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.limitRules && (
            <CardContent className="pt-0">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {limitRules.map((rule, index) => (
                    <div
                      key={`rule-${index}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        {rule.replace(/^・\s*/, "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Motivational Footer */}
        <div className="text-center py-8">
          {hasGoals ? (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">今日も一歩前進！</h3>
              <p className="text-blue-100">
                小さな積み重ねが、大きな成果につながります。継続することで必ず理想の未来に到達できます。
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">
                目標設定を始めましょう！
              </h3>
              <p className="text-green-100 mb-4">
                チャットで目標設定を行うことで、あなたの理想のライフスタイルを実現するための具体的な計画を立てることができます。
              </p>
              <a
                href="/dashboard"
                className="inline-block bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                チャットで目標設定を始める
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
