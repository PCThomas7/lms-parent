import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/redux/hooks";
import { selectreport } from "@/redux/slices/report";
import { selectSections } from "@/redux/slices/quizSlice";
import AppHeader from "../header";
import SectionDropdown from "../SectionDropdown";
import KatexRendered from "./katexRenderer";

// ---- Types ----
interface Question {
  _id: string;
  question_text?: string;
  question_type?: string;
  tags?: { question_type: string };
  correct_answer?: string[];
  image_url?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  option_a_image_url?: string;
  option_b_image_url?: string;
  option_c_image_url?: string;
  option_d_image_url?: string;
  option_e_image_url?: string;
}

interface Section {
  name: string;
  questions: Question[];
}

interface Report {
  _id: string;
  answers: Record<string, string[]>;
}

const Solutions: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useAppSelector(selectreport);
  const newData: Report | undefined = data.find((item) => item._id === id);
  const sections = useAppSelector(selectSections);
  const [questionHeights, setQuestionHeights] = useState<{
    [questionId: string]: number;
  }>({});

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions?.[currentQuestionIndex];

  // --- Check if question was attempted ---
  const isQuestionAttempted = (questionId: string): boolean => {
    const answers = newData?.answers?.[questionId];
    return (
      !!answers &&
      answers.length > 0 &&
      answers.some((answer) => answer.trim() !== "")
    );
  };

  // --- Answer status ---
  const getAnswerStatus = (questionId: string, option: string) => {
    const answers = newData?.answers?.[questionId];
    if (
      !answers ||
      answers.length === 0 ||
      answers.every((answer) => answer.trim() === "")
    ) {
      return "unattempted";
    }
    const isCorrect = currentQuestion?.correct_answer?.includes(option);
    const isSelected = answers.includes(option);
    if (isSelected && isCorrect) return "correct";
    if (isSelected && !isCorrect) return "wrong";
    if (!isSelected && isCorrect) return "missed";
    return "unattempted";
  };

  // --- Render option ---
  const renderOption = (optionKey: "A" | "B" | "C" | "D" | "E") => {
    const key = optionKey.toLowerCase();
    const value = (currentQuestion as any)[`option_${key}`];
    const imageUrl = (currentQuestion as any)[`option_${key}_image_url`];
    if (!value && !imageUrl) return null;

    const status = getAnswerStatus(currentQuestion._id, optionKey);

    const containerStyle: any = {
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      justifyContent: "space-between",
    };

    switch (status) {
      case "correct":
        containerStyle.borderColor = "#3ec170";
        containerStyle.backgroundColor = "#e6f9f0";
        break;
      case "wrong":
        containerStyle.borderColor = "#F44336";
        containerStyle.backgroundColor = "#fde8e8";
        break;
      case "missed":
        containerStyle.borderColor = "#3ec170";
        containerStyle.backgroundColor = "#f0fff4";
        break;
      default:
        containerStyle.borderColor = "#bdbdbd";
        containerStyle.backgroundColor = "#f3f4f6";
    }

    const showIcon = status === "correct" || status === "wrong";

    return (
      <View key={optionKey} style={containerStyle}>
        {/* Left side: Label + Content */}
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>
            {optionKey}.
          </Text>

          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.optionImage}
              resizeMode="contain"
            />
          ) : value && (value.includes("$") || value.includes("\\")) ? (
            <KatexRendered content={value} style={styles.mathView} />
          ) : value ? (
            <Text style={{ fontSize: 15, color: "#1f2937", fontWeight: "500" }}>
              {value.replace(/\\/g, "")}
            </Text>
          ) : null}
        </View>

        {/* Right side: Status Icon */}
        {showIcon && (
          <Ionicons
            name={status === "correct" ? "checkmark-circle" : "close-circle"}
            size={20}
            color={status === "correct" ? "#3ec170" : "#F44336"}
          />
        )}
      </View>
    );
  };

  // --- Early return if no question ---
  if (!currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No questions found in this section.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader screenTitle="Solutions" onBackPress={() => router.back()} />

      <ScrollView className="mt-3">
        {/* Section Dropdown */}
        <SectionDropdown
          sections={sections}
          currentIndex={currentSectionIndex}
          onChange={(index) => {
            setCurrentSectionIndex(index);
            setCurrentQuestionIndex(0); // Reset to first question when changing sections
          }}
        />

        {/* Question */}
        <View className="mb-3 px-5 p-4 bg-slate-50 rounded-xl">
          <View className="flex-column items-start gap-2 mb-2">
            <Text className="text-base font-semibold text-black">
              Question {""} {currentQuestionIndex + 1} of{" "}
              {currentSection.questions.length}
            </Text>

            <View style={{ flex: 1 }}>
              {currentQuestion.question_text?.includes("$") ||
              currentQuestion.question_text?.includes("\\") ? (
                <View
                  style={{ minHeight: 1 }}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    const currentHeight =
                      questionHeights[currentQuestion._id] || 0;
                    if (Math.abs(currentHeight - height) > 2) {
                      setQuestionHeights((prev) => ({
                        ...prev,
                        [currentQuestion._id]: height,
                      }));
                    }
                  }}
                >
                  <KatexRendered
                    key={currentQuestion._id}
                    content={currentQuestion.question_text || ""}
                    style={styles.mathView}
                  />
                </View>
              ) : (
                <Text
                  className="text-sm font-semibold text-slate-800"
                  selectable={false}
                >
                  {currentQuestion.question_text?.replace(/\\/g, "")}
                </Text>
              )}
            </View>
          </View>

          {currentQuestion.image_url && (
            <Image
              source={{ uri: currentQuestion.image_url }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}

          {!isQuestionAttempted(currentQuestion._id) && (
            <View style={styles.unattemptedContainer}>
              <Ionicons name="alert-circle" size={20} color="#f59e0b" />
              <Text style={styles.unattemptedText}>
                This question was not attempted
              </Text>
            </View>
          )}
        </View>

        {/* Options or Numeric Answer */}
        <View className="mb-6 px-5">
          {currentQuestion.tags?.question_type === "Numeric" ? (
            <View style={styles.answerCard}>
              {/* Correct Answer */}
              <View style={[styles.answerRow, { backgroundColor: "#ecfdf5" }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={[styles.answerLabel, { color: "#059669" }]}>
                  Correct Answer:
                </Text>
                <Text style={[styles.answerValue, { color: "#059669" }]}>
                  {currentQuestion.correct_answer?.[0] || "N/A"}
                </Text>
              </View>

              {/* Your Answer */}
              <View
                style={[
                  styles.answerRow,
                  {
                    backgroundColor: isQuestionAttempted(currentQuestion._id)
                      ? "#fef2f2"
                      : "#f3f4f6",
                  },
                ]}
              >
                <Ionicons
                  name={
                    isQuestionAttempted(currentQuestion._id)
                      ? "close-circle"
                      : "help-circle"
                  }
                  size={20}
                  color={
                    isQuestionAttempted(currentQuestion._id)
                      ? "#dc2626"
                      : "#6b7280"
                  }
                />
                <Text
                  style={[
                    styles.answerLabel,
                    {
                      color: isQuestionAttempted(currentQuestion._id)
                        ? "#dc2626"
                        : "#6b7280",
                    },
                  ]}
                >
                  Your Answer:
                </Text>
                <Text
                  style={[
                    styles.answerValue,
                    {
                      color: isQuestionAttempted(currentQuestion._id)
                        ? "#dc2626"
                        : "#6b7280",
                    },
                  ]}
                >
                  {newData?.answers?.[currentQuestion._id]?.[0] ||
                    "Unattempted"}
                </Text>
              </View>
            </View>
          ) : (
            ["A", "B", "C", "D", "E"].map((opt) => renderOption(opt as any))
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between px-5 py-4 border-t border-gray-200 bg-white">
        {/* Prev */}
        <TouchableOpacity
          onPress={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex((prev) => prev - 1);
            } else if (currentSectionIndex > 0) {
              const prevSectionIndex = currentSectionIndex - 1;
              const prevSectionQuestions = sections[prevSectionIndex].questions;
              setCurrentSectionIndex(prevSectionIndex);
              setCurrentQuestionIndex(prevSectionQuestions.length - 1);
            }
          }}
          disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
          className={`px-4 py-3 rounded-xl ${
            currentSectionIndex === 0 && currentQuestionIndex === 0
              ? "bg-gray-300"
              : "bg-indigo-600"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              currentSectionIndex === 0 && currentQuestionIndex === 0
                ? "text-gray-600"
                : "text-white"
            }`}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={() => {
            if (currentQuestionIndex < currentSection.questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1);
            } else if (currentSectionIndex < sections.length - 1) {
              setCurrentSectionIndex(currentSectionIndex + 1);
              setCurrentQuestionIndex(0);
            }
          }}
          disabled={
            currentSectionIndex === sections.length - 1 &&
            currentQuestionIndex === currentSection.questions.length - 1
          }
          className={`px-4 py-3 rounded-xl ${
            currentSectionIndex === sections.length - 1 &&
            currentQuestionIndex === currentSection.questions.length - 1
              ? "bg-gray-300"
              : "bg-indigo-600"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              currentSectionIndex === sections.length - 1 &&
              currentQuestionIndex === currentSection.questions.length - 1
                ? "text-gray-600"
                : "text-white"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Solutions;

const styles = StyleSheet.create({
  questionImage: {
    width: "100%",
    height: 200,
    marginTop: 12,
    borderRadius: 4,
  },
  optionImage: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  answerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  answerLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  answerValue: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },
  unattemptedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fcd34d",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  unattemptedText: {
    color: "#d97706",
    fontWeight: "500",
    fontSize: 14,
  },
  mathView: {
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "100%",
    alignSelf: "flex-start",
  },
});
