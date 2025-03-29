import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function DocumentationPanel() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Select a template or start from scratch. Write your Stellar code and click "Run Code" to execute it.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-1">Available Templates</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Create Account - Generate a new Stellar account</li>
              <li>• Check Balance - View an account's balance</li>
              <li>• Send Payment - Transfer assets between accounts</li>
              <li>• Create Trustline - Set up a trustline for a custom asset</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-1">Useful Links</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <a
                  href="https://developers.stellar.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Stellar Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://laboratory.stellar.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Stellar Laboratory
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/stellar/js-stellar-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Stellar SDK for JavaScript
                </a>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

