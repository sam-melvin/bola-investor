<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Digital Tally model
 */
class SamInvestor extends Model
{
    /**
     * Status constant
     */
    const STATUS_ACTIVE = '1';
    const STATUS_DEACTIVATE = '0';

    /**
     *  Set the table name
     * @var string
     */
    protected $table = 'sam_investor';

    /**
     * Disable this feature
     * @var boolean
     */
    public $timestamps = false;


    /**
     * Grab to get users or agents details
     * @return App\Models\User
     */
    // public function user()
    // {
    //     return User::firstWhere('user_id_code', $this->agent_code);
    // }
}