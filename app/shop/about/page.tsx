import Link from "next/link";

export default function ShopAbout() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center font-sans p-8">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 px-12">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    About Our Shop
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-md">
                    We source only the finest materials and work with artisans worldwide to bring you quality products.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/shop"
                        className="px-6 py-2 rounded-full bg-zinc-950 text-zinc-50 hover:bg-zinc-800 transition-colors dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        Back to Shop
                    </Link>
                </div>
            </main>
        </div>
    );
}
