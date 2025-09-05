import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";

const ConnectSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/40 to-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              We connect <br />
              <span className="text-primary">Buyers & Sellers</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl">
              <strong>Business Gurujee</strong> is India's trusted online B2B
              marketplace, helping buyers connect with verified suppliers across
              industries. Our mission is to simplify trade by providing a safe,
              reliable, and quick assistance platform for businesses of all
              sizes.
            </p>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-background shadow-md rounded-xl p-6 hover:shadow-lg transition">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="font-semibold text-foreground">
                  Trusted Platform
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Verified suppliers & genuine connections.
                </p>
              </div>
              <div className="bg-background shadow-md rounded-xl p-6 hover:shadow-lg transition">
                <CheckCircle2 className="h-10 w-10 mx-auto text-green-600 mb-3" />
                <p className="font-semibold text-foreground">Safe & Secure</p>
                <p className="text-sm text-muted-foreground mt-2">
                  End-to-end secure business deals.
                </p>
              </div>
              <div className="bg-background shadow-md rounded-xl p-6 hover:shadow-lg transition">
                <Clock className="h-10 w-10 mx-auto text-yellow-500 mb-3" />
                <p className="font-semibold text-foreground">
                  Quick Assistance
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Fast responses to your requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="bg-background p-10 rounded-2xl shadow-xl border border-border">
            <h3 className="text-2xl font-semibold text-foreground mb-4 text-center">
              Send an Inquiry
            </h3>
            <p className="text-center text-muted-foreground mb-8">
              Share your business requirements with{" "}
              <strong>Business Gurujee</strong>, and we’ll connect you with the
              right suppliers.
            </p>
            <form className="space-y-5">
              <Input placeholder="Your Name" className="h-12" />
              <Input type="email" placeholder="Your Email" className="h-12" />
              <Input type="tel" placeholder="Phone Number" className="h-12" />
              <Textarea
                placeholder="Your Requirement / Message"
                className="min-h-[120px]"
              />
              <Button type="submit" size="lg" className="w-full">
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
