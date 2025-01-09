import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultsProps {
  recommendedTests: string[]
}

export default function Results({ recommendedTests }: ResultsProps) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Recommended Health Tests</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendedTests.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {recommendedTests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        ) : (
          <p>Based on your responses, no specific tests are recommended at this time. However, regular check-ups are always beneficial for maintaining good health.</p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          Please consult with a healthcare professional for personalized medical advice and to discuss these recommendations.
        </p>
      </CardContent>
    </Card>
  )
}

