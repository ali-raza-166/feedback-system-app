import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export default function ResetPasswordEmailTemplate({
  username,
  resetLink,
}: ResetPasswordEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Email Link</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your reset password link: {resetLink}</Preview>
      <Section>
        <Row>
          <Heading as="h4">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Please use the following reset password link to recover your password
          </Text>
        </Row>
        <Row>
          <Link href={`${resetLink}`}>Click here</Link>
          <span> to reset your password</span>
        </Row>
        <Row>
          <Text>
            If you did not request the reset password link, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
