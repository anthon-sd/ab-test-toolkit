import { Rocket, ArrowRight, ExternalLink } from 'lucide-react';

export default function WhatsNextSection() {
  return (
    <div className="bg-[#004f80] rounded-lg shadow-lg text-white">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-[#ffaa0c]" />
          <h2 className="text-2xl font-bold">What's Next? Unlock More Insights with Swayven Digital</h2>
        </div>
        
        <p className="text-white text-lg mb-8">
          Now that you've analyzed your A/B test results, what's your next move? Whether your test was a success or revealed areas for improvement, the journey to optimizing your game's performance doesn't stop here.
        </p>

        <h3 className="text-xl font-semibold mb-6 text-[#ffaa0c]">Explore more ways to turn data into action with Swayven Digital:</h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-[#0d2d52] backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3 text-[#ffaa0c]">Game Reporting & Analysis</h4>
            <p className="text-white mb-4">
              Get deeper insights into player behavior, retention trends, and monetization strategies with our Game Reporting & Analysis services.
            </p>
            <a 
              href="https://swayvendigital.com/services/game-reporting-analysis/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#4ac7e9] hover:text-[#ffaa0c] transition-colors"
            >
              Learn more <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="bg-[#0d2d52] backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3 text-[#ffaa0c]">LiveOps Optimization</h4>
            <p className="text-white mb-4">
              Use data-driven strategies to boost engagement, personalize in-game events, and maximize revenue through ongoing LiveOps improvements.
            </p>
            <a 
              href="https://swayvendigital.com/services/game-liveops-optimisation/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#4ac7e9] hover:text-[#ffaa0c] transition-colors"
            >
              Learn more <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="bg-[#0d2d52] backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3 text-[#ffaa0c]">Game Design Optimization</h4>
            <p className="text-white mb-4">
              Leverage analytics to fine-tune game mechanics, progression systems, and in-game economy for better player satisfaction and profitability.
            </p>
            <a 
              href="https://swayvendigital.com/services/game-design-optimisation/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#4ac7e9] hover:text-[#ffaa0c] transition-colors"
            >
              Learn more <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="bg-[#0d2d52] backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3 text-[#ffaa0c]">The Playable Data Community</h4>
            <p className="text-white mb-4">
              Join fellow developers, analysts, and industry experts in our dedicated Discord community to discuss game data, A/B testing, and optimization strategies.
            </p>
            <a 
              href="https://discord.gg/m9YwpA2Xjd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#4ac7e9] hover:text-[#ffaa0c] transition-colors"
            >
              Join Discord <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="bg-[#0d2d52] backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3 text-[#ffaa0c]">Case Studies & Insights</h4>
            <p className="text-white mb-4">
              See how other studios have used data to scale and succeed. Learn from real-world examples and best practices.
            </p>
            <a 
              href="https://swayvendigital.com/category/case-studies/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#4ac7e9] hover:text-[#ffaa0c] transition-colors"
            >
              View case studies <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        <div className="bg-[#0d2d52] rounded-lg p-8 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 text-[#ffaa0c]">Looking for tailored analytics support?</h3>
          <p className="text-white mb-6">
            Let's chat! Our team is here to help you unlock your game's full potential with data-driven decision-making.
          </p>
          <a 
            href="https://swayvendigital.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#ffaa0c] text-[#004f80] px-6 py-3 rounded-lg font-semibold hover:bg-[#4ac7e9] transition-colors"
          >
            Contact us today <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xl font-semibold flex items-center justify-center gap-2">
            <Rocket className="w-6 h-6 text-[#ffaa0c]" /> 
            <span className="text-[#ffaa0c]">Keep testing, optimizing, and growing with Swayven Digital.</span>
          </p>
        </div>
      </div>
    </div>
  );
}