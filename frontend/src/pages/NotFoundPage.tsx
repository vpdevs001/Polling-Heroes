import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
      <Card>
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-2 text-zinc-400">
          The page you are looking for does not exist.
        </p>
        <Link className="mt-6 inline-block" to="/">
          <Button type="button">Go home</Button>
        </Link>
      </Card>
    </div>
  );
}
