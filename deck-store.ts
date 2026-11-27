"use client";

import type { DeckDetail, DeckSummary, GeneratedCard, StudyCard } from "@/lib/ai-types";

const KEY = "scholarai:decks:v1";

function read(): DeckDetail[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value as DeckDetail[] : [];
  } catch {
    return [];
  }
}

function write(decks: DeckDetail[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(decks));
}

export function saveDeck(input: {
  id: number; title: string; subject: string; sourceType: string; summary: string;
  generatedBy: "gemini" | "deterministic"; cards: GeneratedCard[];
}): DeckDetail {
  const createdAt = new Date().toISOString();
  const cards: StudyCard[] = input.cards.map((card, index) => ({
    id: index + 1, deckId: input.id, subject: input.subject, kind: card.kind,
    front: card.front, back: card.back, imageId: null, ease: 2.5,
    interval: 0, reps: 0, lapses: 0, dueAt: createdAt,
  }));
  const deck: DeckDetail = {
    id: input.id, title: input.title, subject: input.subject, sourceType: input.sourceType,
    summary: input.summary, generatedBy: input.generatedBy, createdAt, imageId: null, cards,
  };
  write([deck, ...read().filter((item) => item.id !== deck.id)]);
  return deck;
}

export function getDeck(id: number): DeckDetail | null {
  return read().find((deck) => deck.id === id) ?? null;
}

export function getDeckSummaries(): DeckSummary[] {
  const now = Date.now();
  return read().map((deck) => ({
    id: deck.id, title: deck.title, subject: deck.subject, sourceType: deck.sourceType,
    summary: deck.summary, generatedBy: deck.generatedBy, totalCards: deck.cards.length,
    dueCards: deck.cards.filter((card) => new Date(card.dueAt).getTime() <= now).length,
    masteredCards: deck.cards.filter((card) => card.interval >= 21).length,
    createdAt: deck.createdAt,
  }));
}

export function updateDeckCard(deckId: number, updated: StudyCard) {
  write(read().map((deck) => deck.id === deckId
    ? { ...deck, cards: deck.cards.map((card) => card.id === updated.id ? updated : card) }
    : deck));
}

export function deleteDeck(id: number) {
  write(read().filter((deck) => deck.id !== id));
}

export function getLocalStats() {
  const decks = read();
  const cards = decks.flatMap((deck) => deck.cards);
  const dueCount = cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now()).length;
  const reviewedToday = cards.filter((card) => card.reps > 0).length;
  const weekly = Array.from({ length: 7 }, (_, index) => ({
    label: new Date(Date.now() - (6 - index) * 86400000).toLocaleDateString("en-US", { weekday: "short" }),
    count: 0,
  }));
  return {
    dueCount, reviewedToday, totalReviews: reviewedToday, streak: 0, weekly,
    attempts: { total: 0, avgPercent: null, bestPercent: null, totalQuestionsAnswered: 0, totalQuestionsTotal: 0 },
    recent: [],
  };
}
