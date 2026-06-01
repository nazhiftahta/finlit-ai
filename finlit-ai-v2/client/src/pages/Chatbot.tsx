import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Send, MessageCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Halo! Saya adalah asisten keuangan pribadi Anda. Saya siap membantu menjawab pertanyaan tentang literasi keuangan, investasi, budgeting, dan pengelolaan uang. Apa yang ingin Anda tanyakan hari ini?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = trpc.chat.ask.useMutation();

  const getErrorReply = (error: unknown) => {
    const message = error instanceof Error ? error.message : '';

    if (
      message.includes('OPENROUTER_API_KEY') ||
      message.includes('GITHUB_MODELS_API_KEY') ||
      message.includes('BUILT_IN_FORGE_API_KEY') ||
      message.includes('OPENAI_API_KEY')
    ) {
      return 'Koneksi AI belum dikonfigurasi. Tambahkan OPENROUTER_API_KEY di file .env, lalu restart server.';
    }

    return 'Terjadi kendala saat memproses pertanyaan Anda. Silakan coba lagi beberapa saat lagi.';
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await chatMutation.mutateAsync({
        message: input,
        conversationHistory: messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: getErrorReply(error),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-primary/5 to-background flex flex-col">
      <div className="container px-4 py-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Asisten Keuangan</h1>
        </div>
        <p className="text-muted-foreground">
          Tanya apapun tentang keuangan pribadi dan investasi
        </p>
      </div>

      <div className="flex-1 overflow-y-auto container px-4">
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card border border-border text-foreground rounded-bl-none'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Streamdown>{message.content}</Streamdown>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-card border border-border text-foreground px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                <span className="text-sm">Sedang mengetik...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="container px-4 py-4 flex-shrink-0 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pertanyaan Anda..."
            disabled={chatMutation.isPending}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={chatMutation.isPending || !input.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
