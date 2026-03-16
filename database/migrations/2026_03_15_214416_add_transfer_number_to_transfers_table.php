<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transfers', function (Blueprint $table) {
            $table->string('transfer_number', 20)->nullable()->unique()->after('id');
        });

        $this->backfillTransferNumbers();
    }

    public function down(): void
    {
        Schema::table('transfers', function (Blueprint $table) {
            $table->dropColumn('transfer_number');
        });
    }

    private function backfillTransferNumbers(): void
    {
        $transfers = DB::table('transfers')->orderBy('transfer_date')->orderBy('id')->get();
        $sequences = [];

        foreach ($transfers as $row) {
            $year = date('Y', strtotime($row->transfer_date));
            $sequences[$year] = ($sequences[$year] ?? 0) + 1;
            $num = sprintf('TBT-%s-%04d', $year, $sequences[$year]);
            DB::table('transfers')->where('id', $row->id)->update(['transfer_number' => $num]);
        }
    }
};
