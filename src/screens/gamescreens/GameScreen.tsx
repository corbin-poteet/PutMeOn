import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const questions = [
  {
    question: 'What song is this?',
    choices: ['Song#1', 'Song#2', 'Song#3', 'Song#4'],
    correctAnswer: 'Song#1'
  },
  {
    question: 'What album is this?',
    choices: ['album#1', 'album#2', 'album#3', 'album#4'],
    correctAnswer: 'album#1'
  },
  {
    question: 'What artist is this?',
    choices: ['artist#1', 'artist#2', 'artist#3', 'artist##4'],
    correctAnswer: 'Artist#1'
  },
  {
    question: 'What band is playing-?',
    choices: ['Band#1', 'Band#2', 'Band#3', 'Band#4'],
    correctAnswer: 'Band#1'
  },
  {
    question: 'What instrument is this?',
    choices: ['Instr#1', 'Instr#2', 'Instr#3', 'Instr#4'],
    correctAnswer: 'Instr#1'
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  question: {
    marginBottom: 20,
    textAlign: 'center'
  }
});

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(null);

  const handleAnswer = (choiceIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = choiceIndex;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      let score = 0;
      for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].choices.indexOf(questions[i].correctAnswer)) {
          score++;
        }
      }
      setScore(score);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const currentChoices = questions[currentQuestion].choices;
  const currentQuestionText = questions[currentQuestion].question;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestionText}</Text>
      {currentChoices.map((choice, choiceIndex) => (
        <Button
          key={choiceIndex}
          title={choice}
          onPress={() => handleAnswer(choiceIndex)}
        />
      ))}
      {score !== null && <Text>Your score: {score} out of {questions.length}</Text>}
    </View>
  );
};

export default Quiz;