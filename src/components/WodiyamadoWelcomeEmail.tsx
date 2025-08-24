import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Heading,
} from "@react-email/components";

interface WodiyamadoWelcomeEmailProps {
  firstName: string;
}

const WodiyamadoWelcomeEmail = ({ firstName }: WodiyamadoWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the Rotaract Club of Wodiyamado!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Club Logo Section */}
        <Section style={{ marginTop: "20px" }}>
          <Img
            src="https://www.racwodiyamado.org/favicon.png"
            width="460"
            height="360"
            alt="Rotaract Club of Wodiyamado Logo"
            style={logo}
          />
        </Section>

        {/* Welcome Heading */}
        <Heading style={heading}>Welcome to the Club, {firstName}!</Heading>

        {/* Main Content */}
        <Section style={mainTextSection}>
          <Text style={paragraph}>
            Thank you for joining the{" "}
            <strong>Rotaract Club of Wodiyamado</strong>! We're thrilled to have
            you as part of our community.
          </Text>
          <Text style={paragraph}>
            Your membership has been accepted, and we’ll be reaching out soon
            with more details on next steps, upcoming events, and how you can
            get involved.
          </Text>
          <Text style={paragraph}>
            In the meantime, feel free to explore our website or check out our
            socials to learn more about what we do.
          </Text>
        </Section>

        {/* Call to Action Buttons */}
        <Section style={buttonContainer}>
          <Button style={button} href="https://www.racwodiyamado.org/">
            Explore Our Website
          </Button>
        </Section>
        <Section style={buttonContainer}>
          <Button
            style={secondaryButton}
            href="https://www.racwodiyamado.org/contact"
          >
            Check Out Our Socials
          </Button>
        </Section>

        <Hr style={hr} />

        {/* Event Highlight Section */}
        <Section style={eventSection}>
          <Heading as="h2" style={subHeading}>
            Join Our Weekly Coffee Time!
          </Heading>
          <Text style={eventText}>
            It’s a great way to meet fellow members, share ideas, and unwind.
            We’d love to see you there!
          </Text>
          <Text style={eventDetails}>
            🗓️ <strong>When:</strong> Every Tuesday, after 5:30 PM
            <br />
            📍 <strong>Where:</strong> Karavan Cake Coffee Food | Next to BIS
          </Text>
          <Section style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              style={button}
              href="https://maps.app.goo.gl/q1QirRANFuzE8Bkx5"
            >
              Get Directions
            </Button>
          </Section>
        </Section>

        <Hr style={hr} />

        {/* Closing */}
        <Section style={mainTextSection}>
          <Text style={paragraph}>Looking forward to connecting soon!</Text>
          <Text style={signature}>
            Best,
            <br />
            The Membership Extension and Retention Team
            <br />
            Rotaract Club of Wodiyamado
          </Text>
        </Section>

        {/* Footer */}
        <Section style={{ textAlign: "center" }}>
          <Text style={footer}>
            Rotaract Club of Wodiyamado &copy; {new Date().getFullYear()}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WodiyamadoWelcomeEmail;

// --- STYLES ---

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 48px 48px 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  color: "#004b8d", // Rotaract Blue
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const subHeading = {
  color: "#004b8d",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 10px 0",
};

const mainTextSection = {
  padding: "0 20px",
};

const paragraph = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
};

const signature = {
  ...paragraph,
  fontStyle: "italic",
};

const buttonContainer = {
  padding: "0 20px",
  marginTop: "12px",
};

const button = {
  backgroundColor: "#D12162",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px",
};

const secondaryButton = {
  ...button,
  backgroundColor: "#fec40d",
  color: "#004b8d",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const eventSection = {
  backgroundColor: "#f7faff",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #cce0ff",
};

const eventText = {
  ...paragraph,
  textAlign: "center" as const,
  margin: "0 0 16px 0",
};

const eventDetails = {
  ...paragraph,
  textAlign: "center" as const,
  lineHeight: "28px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
