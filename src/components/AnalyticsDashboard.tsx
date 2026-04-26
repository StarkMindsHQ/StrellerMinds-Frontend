// AnalyticsDashboard.tsx
import QuestionBreakdown from './QuestionBreakdown';
import TopicPerformance from './TopicPerformance';
import ScoreChart from './ScoreChart';
import ExportButton from './ExportButton';
import { groupByTopic } from '../utils/analytics.helpers';

const AnalyticsDashboard = ({ questions }) => {
  const topics = groupByTopic(questions);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Test Analytics
        </h2>
        <ExportButton data={questions} />
      </div>

      {/* 🔹 Chart */}
      <ScoreChart data={topics} />

      {/* 🔹 Topic Performance */}
      <TopicPerformance topics={topics} />

      {/* 🔹 Question Breakdown */}
      <QuestionBreakdown questions={questions} />
    </div>
  );
};

export default AnalyticsDashboard;