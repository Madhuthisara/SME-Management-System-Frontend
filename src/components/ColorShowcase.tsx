import React from 'react';

const ColorShowcase: React.FC = () => {
    return (
        <div className="p-8 space-y-8 bg-white rounded-lg shadow-base">
            <h2 className="text-h2 font-bold text-common-primary border-b pb-4">
                Common Color Showcase
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary Color */}
                <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-common-primary rounded-full mb-4 shadow-sm"></div>
                    <span className="text-common-primary font-bold text-lg">Primary</span>
                    <code className="text-sm text-common-third mt-2">text-common-primary</code>
                    <code className="text-sm text-common-third">bg-common-primary</code>
                    <p className="mt-2 text-center text-sm text-common-secondary">
                        Used for main text and critical elements.
                    </p>
                </div>

                {/* Secondary Color */}
                <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-common-secondary rounded-full mb-4 shadow-sm"></div>
                    <span className="text-common-secondary font-bold text-lg">Secondary</span>
                    <code className="text-sm text-common-third mt-2">text-common-secondary</code>
                    <code className="text-sm text-common-third">bg-common-secondary</code>
                    <p className="mt-2 text-center text-sm text-common-secondary">
                        Used for secondary text and sub-headings.
                    </p>
                </div>

                {/* Third Color */}
                <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-common-third rounded-full mb-4 shadow-sm"></div>
                    <span className="text-common-third font-bold text-lg">Third</span>
                    <code className="text-sm text-common-third mt-2">text-common-third</code>
                    <code className="text-sm text-common-third">bg-common-third</code>
                    <p className="mt-2 text-center text-sm text-common-secondary">
                        Used for tertiary text, hints, and icons.
                    </p>
                </div>

                {/* Fourth Color */}
                <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-common-fourth rounded-full mb-4 shadow-sm"></div>
                    <span className="text-common-fourth font-bold text-lg">Fourth</span>
                    <code className="text-sm text-common-third mt-2">text-common-fourth</code>
                    <code className="text-sm text-common-third">bg-common-fourth</code>
                    <p className="mt-2 text-center text-sm text-common-secondary">
                        Used for disabled states or subtle borders.
                    </p>
                </div>

                {/* Fifth Color */}
                <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-common-fifth rounded-full mb-4 shadow-sm"></div>
                    <span className="text-common-fifth font-bold text-lg">Fifth</span>
                    <code className="text-sm text-common-third mt-2">text-common-fifth</code>
                    <code className="text-sm text-common-third">bg-common-fifth</code>
                    <p className="mt-2 text-center text-sm text-common-secondary">
                        Used for very subtle backgrounds or dividers.
                    </p>
                </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-dashed border-common-fourth">
                <h3 className="text-xl font-semibold text-common-primary mb-4">Sample Usage</h3>
                <div className="space-y-4">
                    <p className="text-common-primary">This is primary text (Black)</p>
                    <p className="text-common-secondary">This is secondary text (Dark Gray)</p>
                    <p className="text-common-third">This is third text (Medium Gray)</p>
                    <p className="text-common-fourth">This is fourth text (Light Gray)</p>
                    <button className="px-6 py-2 bg-common-primary text-white rounded-md hover:bg-common-secondary transition-colors">
                        Primary Button
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColorShowcase;
