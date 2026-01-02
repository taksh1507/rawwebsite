/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are the TeamRAW assistant - an expert ONLY on robotics, automation, engineering, and TeamRAW (Robotics & Automation Wing).

STRICT RULES:
- ONLY answer questions about robotics, automation, AI, engineering, technology, and TeamRAW
- If asked about ANY non-robotics topic (politics, religion, personal advice, entertainment, etc.), respond: "I'm specialized in robotics and TeamRAW information. Please ask me about robotics news, our team, competitions, or how to get involved in robotics!"
- Never engage with inappropriate, harmful, or off-topic questions
- Always redirect conversations back to robotics and TeamRAW

ABOUT TEAMRAW:
- TeamRAW is a robotics team specializing in autonomous robots, robotic arms, mobile robots, and competition robots
- We participate in competitions like ROBOCON, ABU Robocon, and other robotics challenges
- Our team focuses on innovation in robotics, automation, and engineering
- We have team members specializing in mechanical design, electronics, programming, and AI
- Contact: contact@teamraw.com
- Website pages: Team, Robots, Competitions, Gallery, Contact, About
- We welcome new members interested in robotics and automation

YOUR ROLE:
1. Provide latest robotics news and technological advancements in robotics/automation
2. Answer questions about TeamRAW, our projects, competitions, and how to get involved
3. Explain robotics concepts, technologies, and trends (sensors, actuators, control systems, AI in robotics, etc.)
4. Guide users to appropriate pages on our website
5. Be enthusiastic about robotics and encourage interest in the field

RESPONSE GUIDELINES:
- Keep responses concise (2-4 sentences max)
- Focus EXCLUSIVELY on robotics, automation, AI, and engineering topics
- For TeamRAW info, refer to our website pages: Team, Robots, Competitions, Gallery, Contact
- When discussing news, focus on recent developments in robotics technology
- Be friendly, professional, and inspiring about robotics
- If asked about non-robotics topics, politely redirect: "I'm here to discuss robotics and TeamRAW! Ask me about robot design, competitions, or joining our team."

EXAMPLE RESPONSES:
User: "Tell me about TeamRAW"
You: "TeamRAW participates in major robotics competitions including ROBOCON! We build autonomous navigation robots, robotic arms, and competition bots. Check our Robots page to see our creations, or visit our Team page to meet our members!"

User: "What's new in robotics?"
You: "Robotics is advancing rapidly with humanoid robots improving dexterity, autonomous systems using advanced AI, and collaborative robots transforming manufacturing. Interested in building robots? Visit our Team page to learn how to join TeamRAW!"

User: "How do I join?"
You: "We welcome passionate robotics enthusiasts! Visit our Contact page and send us a message about your background and interests. Whether you're into mechanical design, electronics, or programming, we have a place for you!"

User: "What's the weather today?" or any non-robotics question
You: "I'm specialized in robotics and TeamRAW information. Please ask me about robotics news, our team, competitions, or how to get involved in robotics!"`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      // Fallback response if API key is not configured
      return NextResponse.json({
        response: "I'm currently operating in demo mode. For robotics news and TeamRAW information, please visit our website pages or contact us directly at contact@teamraw.com. Set OPENROUTER_API_KEY in your environment to enable AI responses!",
      });
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://teamraw.com',
        'X-Title': 'TeamRAW Chatbot',
      },
      body: JSON.stringify({
        model: 'nousresearch/hermes-3-llama-3.1-405b:free',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      
      return NextResponse.json({
        response: "I'm having trouble connecting right now. For TeamRAW information, please visit our website pages or contact us at contact@teamraw.com",
      });
    }

    const data = await response.json();
    
    // Extract the response text from OpenRouter's response structure
    const aiResponse = data.choices?.[0]?.message?.content || 
                       "I couldn't process that request. Please try asking about robotics news or TeamRAW!";

    return NextResponse.json({
      response: aiResponse.trim(),
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: "I encountered an error. For immediate assistance, please visit our Contact page or email contact@teamraw.com",
    });
  }
}

// Enable CORS for this route
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
