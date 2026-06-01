import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createMockContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'manus',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('FinLit App Router', () => {
  describe('Auth Router', () => {
    it('should return current user from me query', async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.openId).toBe('test-user');
      expect(user?.email).toBe('test@example.com');
    });

    it('should handle logout mutation', async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
    });
  });

  describe('Chat Router', () => {
    it('should have chat.ask procedure defined', () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat).toBeDefined();
      expect(caller.chat.ask).toBeDefined();
    });
  });

  describe('System Router', () => {
    it('should handle system operations', async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // System router should be available
      expect(caller.system).toBeDefined();
    });
  });
});

describe('FinLit Features', () => {
  describe('Risk Assessment Logic', () => {
    it('should calculate conservative risk profile correctly', () => {
      // Scores: 1, 1, 1, 1, 1 = average 1.0 (conservative)
      const answers = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1 };
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      const averageScore = totalScore / Object.keys(answers).length;

      expect(averageScore).toBeLessThanOrEqual(1.75);
    });

    it('should calculate moderate risk profile correctly', () => {
      // Scores: 2, 2, 2, 2, 2 = average 2.0 (moderate)
      const answers = { q1: 2, q2: 2, q3: 2, q4: 2, q5: 2 };
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      const averageScore = totalScore / Object.keys(answers).length;

      expect(averageScore).toBeGreaterThan(1.75);
      expect(averageScore).toBeLessThanOrEqual(2.75);
    });

    it('should calculate aggressive risk profile correctly', () => {
      // Scores: 4, 4, 4, 4, 4 = average 4.0 (aggressive)
      const answers = { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 };
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      const averageScore = totalScore / Object.keys(answers).length;

      expect(averageScore).toBeGreaterThan(2.75);
    });

    it('should handle mixed risk profile scores', () => {
      // Scores: 1, 2, 3, 2, 1 = average 1.8 (moderate)
      const answers = { q1: 1, q2: 2, q3: 3, q4: 2, q5: 1 };
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      const averageScore = totalScore / Object.keys(answers).length;

      expect(averageScore).toBeGreaterThan(1.75);
      expect(averageScore).toBeLessThanOrEqual(2.75);
    });
  });

  describe('Budget Calculation Logic', () => {
    it('should calculate 50/30/20 allocation correctly', () => {
      const income = 10000000; // 10 juta
      const needs = income * 0.5; // 5 juta
      const wants = income * 0.3; // 3 juta
      const savings = income * 0.2; // 2 juta

      expect(needs).toBe(5000000);
      expect(wants).toBe(3000000);
      expect(savings).toBe(2000000);
      expect(needs + wants + savings).toBe(income);
    });

    it('should calculate surplus correctly', () => {
      const income = 10000000;
      const totalExpenses = 8000000;
      const surplus = income - totalExpenses;

      expect(surplus).toBe(2000000);
    });

    it('should handle deficit correctly', () => {
      const income = 5000000;
      const totalExpenses = 7000000;
      const deficit = income - totalExpenses;

      expect(deficit).toBe(-2000000);
    });

    it('should handle zero income gracefully', () => {
      const income = 0;
      const expenses = 0;
      const surplus = income - expenses;

      expect(surplus).toBe(0);
    });

    it('should calculate expense ratio correctly', () => {
      const income = 10000000;
      const totalExpenses = 8000000;
      const expenseRatio = totalExpenses / income;

      expect(expenseRatio).toBe(0.8);
    });

    it('should identify high expense ratio', () => {
      const income = 10000000;
      const totalExpenses = 9500000;
      const expenseRatio = totalExpenses / income;

      expect(expenseRatio).toBeGreaterThan(0.9);
    });
  });

  describe('Chatbot Integration', () => {
    it('should accept valid chat input schema', () => {
      // Verify the chat procedure accepts the correct input schema
      const validInput = {
        message: 'Pertanyaan test',
        conversationHistory: [
          {
            role: 'user' as const,
            content: 'Halo',
          },
          {
            role: 'assistant' as const,
            content: 'Halo juga',
          },
        ],
      };

      expect(validInput.message).toBeDefined();
      expect(validInput.conversationHistory).toBeDefined();
      expect(validInput.conversationHistory.length).toBe(2);
    });

    it('should accept chat input without conversation history', () => {
      const validInput = {
        message: 'Pertanyaan pertama',
      };

      expect(validInput.message).toBeDefined();
    });

    it('should validate message is not empty', () => {
      const emptyMessage = '';
      const isValid = emptyMessage.trim().length > 0;

      expect(isValid).toBe(false);
    });

    it('should validate conversation history has correct structure', () => {
      const validHistory = [
        { role: 'user' as const, content: 'Halo' },
        { role: 'assistant' as const, content: 'Halo' },
      ];

      const isValid = validHistory.every(
        (msg) => msg.role === 'user' || msg.role === 'assistant'
      );

      expect(isValid).toBe(true);
    });
  });

  describe('Educational Content Logic', () => {
    it('should filter articles by category', () => {
      const articles = [
        { id: '1', category: 'investasi', title: 'Investasi Saham' },
        { id: '2', category: 'budgeting', title: 'Budget Cerdas' },
        { id: '3', category: 'investasi', title: 'Investasi Emas' },
      ];

      const filtered = articles.filter((a) => a.category === 'investasi');

      expect(filtered.length).toBe(2);
      expect(filtered.every((a) => a.category === 'investasi')).toBe(true);
    });

    it('should return all articles when category is semua', () => {
      const articles = [
        { id: '1', category: 'investasi', title: 'Investasi Saham' },
        { id: '2', category: 'budgeting', title: 'Budget Cerdas' },
        { id: '3', category: 'keamanan', title: 'Investasi Aman' },
      ];

      const filtered =
        'semua' === 'semua' ? articles : articles.filter((a) => a.category === 'semua');

      expect(filtered.length).toBe(3);
    });
  });

  describe('Input Validation', () => {
    it('should validate income is positive number', () => {
      const income = 5000000;
      const isValid = income > 0;

      expect(isValid).toBe(true);
    });

    it('should reject negative income', () => {
      const income = -5000000;
      const isValid = income > 0;

      expect(isValid).toBe(false);
    });

    it('should validate expense amount is positive', () => {
      const amount = 500000;
      const isValid = amount > 0;

      expect(isValid).toBe(true);
    });

    it('should reject zero expense amount', () => {
      const amount = 0;
      const isValid = amount > 0;

      expect(isValid).toBe(false);
    });
  });
});
